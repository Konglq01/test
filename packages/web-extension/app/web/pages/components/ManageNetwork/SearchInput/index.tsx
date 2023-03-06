import { ChainItemType } from '@portkey-wallet/types/chain';
import { DropdownProps } from 'antd';
import DropdownSearch from 'components/DropdownSearch';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'react-use';
import './index.less';

interface SearchInputProps extends Omit<DropdownProps, 'overlay'> {
  dataSource: ChainItemType[];
  onNetworkSearch?: (search: string, v?: ChainItemType[]) => void;
}

export default function SearchInput({ dataSource = [], onNetworkSearch, ...props }: SearchInputProps) {
  const { t } = useTranslation();
  const [openDrop, setOpenDrop] = useState<boolean>();
  const [filterWord, setFilterWord] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [filterList, setFilter] = useState<any[]>([]);

  useDebounce(
    () => {
      setSearch(filterWord);
    },
    300,
    [filterWord],
  );

  useEffect(() => {
    if (!search) setOpenDrop(false);
    let list = dataSource.filter((item) => item.networkName.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
    setFilter(list);
    if (!list?.length && search) {
      setOpenDrop(true);
      list = dataSource;
    } else {
      setOpenDrop(false);
    }
    onNetworkSearch?.(search, list);
  }, [dataSource, onNetworkSearch, search]);

  return (
    <DropdownSearch
      overlayClassName="empty-dropdown"
      open={openDrop}
      overlay={<div className="empty-tip">{t('There is no search result.')}</div>}
      inputProps={{
        onFocus: () => {
          if (filterWord && !filterList.length) setOpenDrop(true);
        },
        onBlur: () => setOpenDrop(false),
        onChange: (e) => setFilterWord(e.target.value),
        placeholder: t('placeholder Network Name'),
      }}
      {...props}
    />
  );
}
