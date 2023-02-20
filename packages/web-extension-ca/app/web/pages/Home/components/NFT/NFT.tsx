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

  const handleChange = useCallback(
    (arr: any) => {
      openPanel.forEach((prev: string) => {
        if (!arr.some((cur: string) => cur === prev)) {
          dispatch(clearNftItem(prev));
        }
      });
      arr.forEach((cur: string) => {
        if (!openPanel.some((prev: string) => cur === prev)) {
          dispatch(fetchNFTAsync({ symbol: cur, caAddresses }));
        }
      });
      setOpenPanel(arr);
    },
    [caAddresses, dispatch, openPanel],
  );

  useEffect(() => {
    dispatch(fetchNFTCollectionsAsync({ caAddresses }));
  }, [caAddresses, dispatch]);

  const renderItem = useCallback(
    (nft: NFTCollectionItemShowType) => {
      return (
        <Collapse.Panel
          key={nft.symbol}
          header={
            <div className="protocol">
              <div className="avatar">
                {nft.imageUrl ? <img src={nft.imageUrl} /> : nft.collectionName?.slice(0, 1)}
              </div>
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
                    style={{
                      backgroundImage: `url('${nftItem.imageUrl}')`,
                    }}
                    className="item"
                    onClick={() => {
                      nav('/nft', { state: { ...nftItem, address: nftItem.tokenContractAddress } });
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
