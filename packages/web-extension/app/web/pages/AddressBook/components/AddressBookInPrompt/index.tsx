import { addressBookUpdate } from '@portkey-wallet/store/addressBook/actions';
import { AddressBookItem } from '@portkey-wallet/types/addressBook';
import { Button, message } from 'antd';
import clsx from 'clsx';
import CustomSvg from 'components/CustomSvg';
import DropdownSearch from 'components/DropdownSearch';
import AddressBookInfo, { validatorAddress, validatorName } from 'pages/components/AddressBookInfo';
import AddressBookContent from 'pages/components/AddressBookInfoDetailDrawer/AddressBookContent';
import PromptSettingColumn from 'pages/components/PromptSettingColumn';
import { useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'react-use';
import { useAddressBook, useAppDispatch, useNetwork } from 'store/Provider/hooks';
import { EditType } from 'types';
import { omitString } from 'utils';
import './index.less';

export default function AddressBookInPrompt() {
  const { t } = useTranslation();
  const [editType, setEditType] = useState<EditType | 'onlyView'>();
  const [openDrop, setOpenDrop] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<AddressBookItem | undefined>(undefined);
  const { addressBook } = useAddressBook();
  const { currentChain } = useNetwork();
  const [searchVal, setSearchVal] = useState<string>();
  const [val, setVal] = useState<string>();
  const dispatch = useAppDispatch();
  const [titleType, setTitleType] = useState<'add' | 'edit' | 'onlyView'>();
  useDebounce(() => setSearchVal(val), 800, [val]);

  const title = useMemo(() => {
    if (titleType === 'add') return 'New contract';
    if (titleType === 'onlyView' || titleType === 'edit') return `Contacts > ${initialValues?.name}`;
    return 'Contacts';
  }, [titleType, initialValues?.name]);

  const onClose = useCallback(() => {
    setEditType(undefined);
    setTitleType(undefined);
    setInitialValues(undefined);
  }, []);

  const onSave = useCallback(
    (v: AddressBookItem) => {
      try {
        dispatch(
          addressBookUpdate({
            type: editType === 'edit' ? 'add' : 'update',
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
    [dispatch, editType, currentChain, onClose],
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

  const rightElement = useMemo(() => {
    if (editType === 'onlyView')
      return (
        <AddressBookContent
          initialValues={initialValues}
          onEdit={() => {
            setEditType('view');
            setTitleType('edit');
          }}
        />
      );
    if (editType === 'edit' || editType === 'view')
      return (
        <AddressBookInfo
          onSave={onSave}
          onRemove={onRemove}
          currentChain={currentChain}
          type={editType}
          initialValues={initialValues}
          validatorName={validatorName(addressBook, currentChain, t, initialValues)}
          validatorAddress={validatorAddress(currentChain, t)}
        />
      );
    return undefined;
  }, [addressBook, currentChain, editType, initialValues, onRemove, onSave]);

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

  return (
    <div className="flex-column address-book-wrapper address-book-in-prompt-wrapper">
      <PromptSettingColumn
        title={
          <div className="flex-between-center title-content">
            <span className="title-text">{title}</span>
            {!editType && (
              <Button
                onClick={() => {
                  setEditType('edit');
                  setTitleType('add');
                }}>
                {t('Add Contact')}
              </Button>
            )}
          </div>
        }
        rightElement={rightElement}>
        <div className="flex-1 flex-column address-book-in-prompt-body">
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
                    setEditType('edit');
                    setTitleType('add');
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
                          setEditType('onlyView');
                          setTitleType('onlyView');
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
        </div>
      </PromptSettingColumn>
    </div>
  );
}
