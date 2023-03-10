import { useCaAddresses, useCurrentWalletInfo } from '@portkey-wallet/hooks/hooks-ca/wallet';
import { clearNftItem, fetchNFTAsync, fetchNFTCollectionsAsync } from '@portkey-wallet/store/store-ca/assets/slice';
import { ChainId } from '@portkey-wallet/types';
import { NFTCollectionItemShowType, NFTItemBaseType } from '@portkey-wallet/types/types-ca/assets';
import { Collapse } from 'antd';
import { List } from 'antd-mobile';
import CustomSvg from 'components/CustomSvg';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import clsx from 'clsx';
import { useAppDispatch, useAssetInfo } from 'store/Provider/hooks';
import './index.less';
import { transNetworkText } from '@portkey-wallet/utils/activity';
import { useIsTestnet } from 'hooks/useActivity';

export default function NFT() {
  const nav = useNavigate();
  const [openPanel, setOpenPanel] = useState<string[]>([]);
  const isTestNet = useIsTestnet();
  const {
    accountNFT: { accountNFTList },
  } = useAssetInfo();
  const dispatch = useAppDispatch();
  const caAddresses = useCaAddresses();
  const wallet = useCurrentWalletInfo();

  const getMore = useCallback(
    (symbol: string, chainId: string) => {
      let pageNum = 0;
      accountNFTList.forEach((nft) => {
        if (nft.symbol === symbol) {
          pageNum = nft.children.length;
        }
      });
      dispatch(
        fetchNFTAsync({ symbol, chainId: chainId as ChainId, caAddresses: [wallet[chainId].caAddress], pageNum }),
      );
    },
    [accountNFTList, dispatch, wallet],
  );

  const handleChange = useCallback(
    (arr: string[] | string) => {
      const openArr = typeof arr === 'string' ? [arr] : arr;
      openPanel.forEach((prev: string) => {
        if (!openArr.some((cur: string) => cur === prev)) {
          dispatch(clearNftItem({ symbol: prev.split('_')[0], chainId: prev.split('_')[1] }));
        }
      });
      openArr.forEach((cur: string) => {
        if (!openPanel.some((prev: string) => cur === prev)) {
          const curTmp = cur.split('_');
          dispatch(
            fetchNFTAsync({
              symbol: curTmp[0],
              chainId: curTmp[1] as ChainId,
              caAddresses: [wallet[curTmp[1]].caAddress],
              pageNum: 0,
            }),
          );
        }
      });
      setOpenPanel(openArr);
    },
    [dispatch, openPanel, wallet],
  );

  useEffect(() => {
    dispatch(fetchNFTCollectionsAsync({ caAddresses }));
  }, [caAddresses, dispatch]);

  const renderItem = useCallback(
    (nft: NFTCollectionItemShowType) => {
      return (
        <Collapse.Panel
          key={`${nft.symbol}_${nft.chainId}`}
          header={
            <div className="protocol">
              <div className="avatar">
                {nft.imageUrl ? <img src={nft.imageUrl} /> : nft.collectionName?.slice(0, 1)}
              </div>
              <div className="info">
                <p className="alias">{nft.collectionName}</p>
                <p className="network">{transNetworkText(nft.chainId, isTestNet)}</p>
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
                    style={{
                      backgroundImage: `url('${nftItem.imageUrl}')`,
                    }}
                    className={clsx(['item', nftItem.imageUrl ? 'item-img' : ''])}
                    onClick={() => {
                      nav('/nft', { state: { ...nftItem, address: nftItem.tokenContractAddress, decimals: 0 } });
                    }}>
                    <div className="mask">
                      <p className="alias">{nftItem.alias}</p>
                      <p className="token-id">#{nftItem.tokenId}</p>
                    </div>
                  </div>
                );
              })}
            {nft.totalRecordCount > nft.children.length && (
              <div
                className="load-more"
                onClick={() => {
                  getMore(nft.symbol, nft.chainId);
                }}>
                <CustomSvg type="Down" /> More
              </div>
            )}
          </div>
        </Collapse.Panel>
      );
    },
    [getMore, isTestNet, nav],
  );

  return (
    <div className="tab-nft">
      {accountNFTList.length === 0 ? (
        <p className="empty-text">No NFTs yet</p>
      ) : (
        <List className="nft-list">
          <List.Item>
            <Collapse onChange={handleChange}>{accountNFTList.map((item) => renderItem(item))}</Collapse>
          </List.Item>
        </List>
      )}
    </div>
  );
}
