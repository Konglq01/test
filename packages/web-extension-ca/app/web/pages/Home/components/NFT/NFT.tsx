import { useCaAddresses } from '@portkey/hooks/hooks-ca/wallet';
import { clearNftItem, fetchNFTAsync, fetchNFTCollectionsAsync } from '@portkey/store/store-ca/assets/slice';
import { NFTCollectionItemShowType, NFTItemBaseType } from '@portkey/types/types-ca/assets';
import { Collapse } from 'antd';
import { List } from 'antd-mobile';
import CustomSvg from 'components/CustomSvg';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAssetInfo, useWalletInfo } from 'store/Provider/hooks';
import './index.less';

export default function NFT() {
  const nav = useNavigate();
  const { currentNetwork } = useWalletInfo();
  const [openPanel, setOpenPanel] = useState<string[]>([]);
  const isTestNet = useMemo(() => (currentNetwork === 'TESTNET' ? 'Testnet' : ''), [currentNetwork]);
  const {
    accountNFT: { accountNFTList },
  } = useAssetInfo();
  const dispatch = useAppDispatch();
  const caAddresses = useCaAddresses();

  const getMore = useCallback(
    (symbol: string) => {
      dispatch(fetchNFTAsync({ symbol, caAddresses }));
    },
    [caAddresses, dispatch],
  );
  console.log('--------accountNFTList------------', accountNFTList);

  const handleChange = useCallback(
    (symbol: string) => {
      const isOpen = openPanel.some((item) => item === symbol);
      if (isOpen) {
        dispatch(clearNftItem(symbol));
        setOpenPanel([...openPanel.filter((item) => item !== symbol)]);
      } else {
        dispatch(fetchNFTAsync({ symbol, caAddresses }));
        setOpenPanel([...openPanel, symbol]);
      }
    },
    [caAddresses, dispatch, openPanel],
  );

  useEffect(() => {
    dispatch(fetchNFTCollectionsAsync({ caAddresses }));
  }, [caAddresses, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearNftItem(''));
    };
  }, [dispatch]);

  const renderItem = useCallback(
    (nft: NFTCollectionItemShowType) => {
      return (
        <Collapse.Panel
          key={nft.symbol}
          header={
            <div className="protocol" onClick={() => handleChange(nft.symbol)}>
              <div className="avatar">{nft.imageUrl || nft.collectionName?.slice(0, 1) || 'M'}</div>
              <div className="info">
                <p className="alias">{nft.collectionName}</p>
                <p className="network">{`${nft?.chainId?.toLocaleUpperCase() === 'AELF' ? 'MainChain' : 'SideChain'} ${
                  nft.chainId
                } ${isTestNet}`}</p>
              </div>
              <div className="amount">{nft.itemCount}</div>
            </div>
          }>
          <div className="list">
            {nft.children.length > 0 &&
              nft.children.map((nftItem: NFTItemBaseType) => {
                return (
                  <div
                    key={`${nft.symbol}-${nftItem.symbol}`}
                    className="item"
                    onClick={() => {
                      nav('/nft', { state: { info: {} } });
                    }}>
                    <div className="mask">
                      <p className="alias">{nftItem.alias}</p>
                      <p className="token-id">{nftItem.tokenId}</p>
                    </div>
                  </div>
                );
              })}
            {nft.totalRecordCount > nft.children.length && (
              <div
                className="load-more"
                onClick={() => {
                  getMore(nft.symbol);
                }}>
                <CustomSvg type="Down" /> More
              </div>
            )}
          </div>
        </Collapse.Panel>
      );
    },
    [getMore, handleChange, isTestNet, nav],
  );

  return (
    <div className="tab-nft">
      {accountNFTList.length === 0 ? (
        <p className="empty-text">No NFTs yet</p>
      ) : (
        <List className="nft-list">
          <List.Item>
            <Collapse>{accountNFTList.map((item) => renderItem(item))}</Collapse>
          </List.Item>
        </List>
      )}
    </div>
  );
}
