import clsx from 'clsx';
import CustomSvg from 'components/CustomSvg';
import { Button, message } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { useDebounce } from 'react-use';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from 'store/Provider/hooks';
import type { EditType } from 'types';
import type { AddressBookItem } from '@portkey-wallet/types/addressBook';
import { omitString } from 'utils';
import { addressBookUpdate } from '@portkey-wallet/store/addressBook/actions';
import AddressBookInfoDrawer from 'pages/components/AddressBookInfoDrawer';
import AddressBookInfoDetailDrawer from 'pages/components/AddressBookInfoDetailDrawer';
import DropdownSearch from 'components/DropdownSearch';
import SettingHeader from 'pages/components/SettingHeader';
import { useTranslation } from 'react-i18next';

export default function AddressBookInPopup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addressBook } = useAppSelector((state) => state.addressBook);
  const { currentChain } = useAppSelector((state) => state.chain);
  const [val, setVal] = useState<string>();
  const [searchVal, setSearchVal] = useState<string>();
  const [openDrop, setOpenDrop] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>();
  const [openDetail, setOpenDetail] = useState<boolean>();
  const [type, setType] = useState<EditType>('edit');
  const [initialValues, setInitialValues] = useState<AddressBookItem | undefined>(undefined);

  const dispatch = useAppDispatch();
  useDebounce(() => setSearchVal(val), 800, [val]);

  const rightElement = useMemo(
    () => <CustomSvg type="Close2" onClick={() => navigate(-1)} style={{ width: 18, height: 18 }} />,
    [navigate],
  );

  const addressBookList = useMemo<any>(() => {
    const result = (addressBook[`${currentChain.rpcUrl}&${currentChain.networkName}`] ?? [])?.filter((item) =>
      searchVal
        ? item.address.toLocaleLowerCase().includes(searchVal.toLocaleLowerCase()) ||
          item?.name.toLocaleLowerCase().includes(searchVal.toLocaleLowerCase())
        : item,
    );

    if (searchVal) setOpenDrop(!result.length);

    return result.reduce((pre: any, cur) => {
      const firstLetter = cur.name?.[0]?.toUpperCase();

      if (pre[firstLetter]) {
        pre[firstLetter][cur.name] = cur;
      } else {
        pre[firstLetter] = { [cur.name]: cur };
      }

      return pre;
    }, {});
  }, [addressBook, searchVal, currentChain]);

  const onClose = useCallback(() => {
    setOpen(false);
    setOpenDetail(false);
    setInitialValues(undefined);
  }, []);

  const onDetailDrawerClose = useCallback(() => {
    setOpenDetail(false);
    setInitialValues(undefined);
  }, []);

  const onSave = useCallback(
    (v: AddressBookItem) => {
      try {
        dispatch(
          addressBookUpdate({
            type: type === 'edit' ? 'add' : 'update',
            addressBook: v,
            currentChain,
          }),
        );
        onClose();
      } catch (e: any) {
        e.message && message.error(e.message);
        console.log(e.message, 'onSave');
      }
    },
    [dispatch, onClose, type, currentChain],
  );

  const onRemove = useCallback(
    (v?: AddressBookItem) => {
      if (!v) return;
      dispatch(
        addressBookUpdate({
          type: 'remove',
          addressBook: v,
          currentChain,
        }),
      );
      onClose();
    },
    [currentChain, dispatch, onClose],
  );

  const titleElement = useMemo(
    () => (
      <div className="header-title">
        <span>{t('Contacts')}</span>
        {Object.keys(addressBookList).length > 0 && (
          <Button
            onClick={() => {
              setOpen(true);
              setType('edit');
            }}>
            {t('Add Contact')}
          </Button>
        )}
      </div>
    ),
    [addressBookList],
  );

  return (
    <div className="flex-column full-screen-height address-book-wrapper">
      <div className={!Object.keys(addressBookList).length ? 'empty-list' : ''}>
        <SettingHeader title={titleElement} rightElement={rightElement} />
      </div>
      <DropdownSearch
        overlayClassName="empty-dropdown"
        open={openDrop}
        overlay={<div className="empty-tip">{t('There is no search result.')}</div>}
        inputProps={{
          onBlur: () => setOpenDrop(false),
          onFocus: () => {
            if (val && !Object.keys(addressBookList).length) setOpenDrop(true);
          },
          onChange: (e) => {
            const _value = e.target.value;
            if (!_value) setOpenDrop(false);

            setVal(_value);
          },
          placeholder: t('Name or Address'),
        }}
      />
      <div className={clsx('flex-1', 'address-booklists')}>
        {!addressBookList || !Object.keys(addressBookList).length ? (
          <div className="empty">
            <div>
              <CustomSvg type="AddressBook" style={{ width: 56, height: 64 }} />
            </div>
            <Button
              className="flex-row-center add-button"
              type="primary"
              onClick={() => {
                setOpen(true);
                setType('edit');
              }}>
              <CustomSvg type="Plus" style={{ width: 12, height: 12 }} /> {t('Add New Contact')}
            </Button>
          </div>
        ) : (
          <div className="address-booklists-content">
            {Object.entries(addressBookList).map(([key, valueList], keyIndex) => (
              <div className="contact-unit" key={keyIndex}>
                <p className="contact-unit-letter">{key}</p>
                {Object.values(valueList || {}).map((valueUnit, innerIndex) => (
                  <div
                    className="contact-unit-item"
                    key={innerIndex}
                    onClick={() => {
                      setType('view');
                      setOpenDetail(true);
                      setInitialValues(valueUnit);
                    }}>
                    <div>{valueUnit.name || ''}</div>
                    <div>{omitString(valueUnit.address || '', 7, 4)}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <AddressBookInfoDrawer
        open={open}
        type={type}
        onClose={onClose}
        onSave={onSave}
        onRemove={onRemove}
        initialValues={initialValues}
      />
      <AddressBookInfoDetailDrawer
        open={openDetail}
        type={type}
        onClose={onDetailDrawerClose}
        onEdit={() => setOpen(true)}
        onRemove={onRemove}
        initialValues={initialValues}
      />
    </div>
  );
}
