import { Button, Form, Input, message, Modal, Select } from 'antd';
import { RuleObject } from 'antd/lib/form';
import { useCallback, useMemo, useState } from 'react';
import type { EditType } from 'types';
import { ChainItemType } from '@portkey/types/chain';
import { NetworkSeries } from '@portkey/constants/network';
import { ChainActionError } from '@portkey/store/network/types';
import { checkNetworkName, checkRpcUrl } from '@portkey/store/network/utils';
import { isUrl } from '@portkey/utils';
import { RequireAllOne } from '@portkey/types';
import './index.less';
import CustomSvg from 'components/CustomSvg';
import { useTranslation } from 'react-i18next';

export type OnFinishCallback = (values: ChainItemType, isChangeNetwork?: boolean) => void;

interface NetworkEditProps {
  type: EditType;
  chainList?: ChainItemType[];
  networkInfo?: RequireAllOne<Partial<ChainItemType>>;
  currentNetworkRpcUrl?: string;
  onFinish?: OnFinishCallback;
  onDelete?: (v: any) => void;
}

const { Item: FormItem } = Form;
const { Option } = Select;

export default function NetworkEdit({
  type,
  networkInfo,
  currentNetworkRpcUrl,
  chainList,
  onDelete,
  onFinish,
}: NetworkEditProps) {
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState<boolean>(type === 'edit');
  const [form] = Form.useForm<ChainItemType>();
  const isViewMode = useMemo(() => type === 'view', [type]);
  const isDisabled = useMemo(() => !isEdit, [isEdit]);
  const [saveDisabled, setSaveDisabled] = useState(true);

  const validateRpcUrl: (_: RuleObject, value: any) => Promise<any> = useCallback(
    async (_, value) => {
      console.log(_, value, 'validateRpcUrl');
      const chainType = form.getFieldValue('chainType');
      try {
        const chainId = await checkRpcUrl({ chainList, rpcUrl: value, chainType, key: networkInfo?.key });
        console.log(chainId, 'chainId===');
      } catch (error: any) {
        console.log(error, 'error===NetworkEdit');
        return Promise.reject(t(error?.message || error || ChainActionError.InvalidRpcUrl));
      }
      return Promise.resolve('');
    },
    [chainList, form, networkInfo?.key, t],
  );

  const validateChainId: (_: RuleObject, value: any) => Promise<any> = useCallback(
    async (_, value) => {
      if (!value) return Promise.reject(t(ChainActionError.noChainId));
      const chainType = form.getFieldValue('chainType');
      const rpcUrl = form.getFieldValue('rpcUrl');
      try {
        const chainId = await checkRpcUrl({ rpcUrl, chainType });
        if (value !== chainId) return Promise.reject(t(ChainActionError.chainIdError));
      } catch (error: any) {
        return Promise.reject(t(error?.message || error || ChainActionError.chainIdError));
      }
      return Promise.resolve('');
    },
    [form, t],
  );

  const finish: OnFinishCallback = useCallback(
    (v, isChange) => {
      onFinish?.({ ...networkInfo, ...v }, isChange);
      form.resetFields();
    },
    [form, networkInfo, onFinish],
  );

  console.log(networkInfo, 'formFinish');

  const formFinish: (values: ChainItemType) => void = useCallback(
    async (v) => {
      try {
        if (currentNetworkRpcUrl === v.rpcUrl) {
          finish(v, true);
        } else {
          Modal.confirm({
            width: 320,
            content: (
              <>
                <h3>{t('Switch to This Network?')}</h3>
                <div className="network-name">
                  <CustomSvg type="Aelf" />
                  <p>{v.networkName}</p>
                </div>
                <p className="rpc-url">{v.rpcUrl}</p>
              </>
            ),
            className: 'edit-network delete-modal',
            icon: null,
            centered: true,
            okText: t('switch Yes'),
            cancelText: t('Not Now'),
            onOk: () => finish(v, true),
            onCancel: () => finish(v, false),
          });
        }
      } catch (error) {
        console.log(error, 'error==');
      }
    },
    [currentNetworkRpcUrl, finish, t],
  );

  const handleFormValuesChange = useCallback((changedValues: any, allValues: any) => {
    const isDisabled = Object.entries(allValues)
      .filter((value) => value[0] !== 'chainType' && value[0] !== 'currencySymbol' && value[0] !== 'blockExplorerURL')
      .some((value) => !(value[1] as string)?.trim());
    setSaveDisabled(isDisabled);
  }, []);

  const handleDelete = useCallback(() => {
    Modal.confirm({
      width: 320,
      content: <p>{t('Delete Network?')}</p>,
      icon: null,
      centered: true,
      className: 'delete-network delete-modal',
      okText: t('Yes'),
      cancelText: t('No'),
      onOk: () => {
        onDelete?.(networkInfo);
      },
    });
  }, [networkInfo, onDelete, t]);

  return (
    <>
      <div className="edit-network-wrapper">
        <Form
          layout="vertical"
          form={form}
          onValuesChange={handleFormValuesChange}
          requiredMark="optional"
          initialValues={networkInfo}
          validateTrigger={'onBlur'}
          autoComplete="off"
          onFinishFailed={(e: any) => {
            message.error('Validation failed');
            console.log(e, 'onFinishFailed');
          }}
          onFinish={formFinish}>
          <div className="edit-content">
            <FormItem name="chainType" label={t('Network Series')} required>
              <Select disabled suffixIcon={''}>
                {NetworkSeries.map((chain) => (
                  <Option key={chain.chainType}>{chain.label}</Option>
                ))}
              </Select>
            </FormItem>

            <FormItem
              name="networkName"
              label={t('Network Name')}
              rules={[
                {
                  required: true,
                  validator(_, value) {
                    try {
                      checkNetworkName(chainList, value, t, networkInfo?.key);
                    } catch (error: any) {
                      return Promise.reject(error?.message || error);
                    }
                    return Promise.resolve();
                  },
                },
              ]}>
              {isDisabled ? (
                <div className="disabled-input">{networkInfo?.networkName}</div>
              ) : (
                <Input maxLength={50} placeholder={t('Enter Name')} />
              )}
            </FormItem>
            <FormItem
              name="rpcUrl"
              required
              label={t('New RPC URL')}
              rules={[
                {
                  required: true,
                  validator: validateRpcUrl,
                },
              ]}>
              {isDisabled ? (
                <div className="disabled-input">{networkInfo?.rpcUrl}</div>
              ) : (
                <Input
                  placeholder="https://URL"
                  onBlur={() => {
                    const formChainId = form.getFieldValue('chainId');
                    if (formChainId) form.validateFields(['chainId']);
                  }}
                />
              )}
            </FormItem>
            <FormItem
              name="chainId"
              label={t('Chain ID')}
              rules={[
                {
                  required: true,
                  validator: validateChainId,
                },
              ]}>
              {isDisabled ? (
                <div className="disabled-input">{networkInfo?.chainId}</div>
              ) : (
                <Input placeholder={t('Enter Chain ID')} />
              )}
            </FormItem>
            <FormItem hidden name="currencySymbol" label="Currency Symbol">
              <Input />
            </FormItem>
            <FormItem
              name="blockExplorerURL"
              label={t('Block Explorer URL')}
              rules={[
                {
                  validator(_, value) {
                    if (!value) return Promise.resolve('');
                    const _isUrl = isUrl(value);
                    if (_isUrl) return Promise.resolve('');
                    return Promise.reject('Invalid Url');
                  },
                },
              ]}>
              {isDisabled ? (
                <div className="disabled-input">{networkInfo?.blockExplorerURL}</div>
              ) : (
                <Input placeholder={t('Enter Block Explorer URL')} />
              )}
            </FormItem>
          </div>
          {!networkInfo?.isFixed && (
            <>
              {isEdit && (
                <div className="edit-footer">
                  {isViewMode && (
                    <Button className="delete-btn" type="link" onClick={handleDelete}>
                      {t('Delete')}
                    </Button>
                  )}
                  <Button disabled={saveDisabled} type="primary" htmlType="submit">
                    {t('Save')}
                  </Button>
                </div>
              )}

              {!isEdit && networkInfo?.isCustom && (
                <div className="edit-footer">
                  <Button type="primary" onClick={() => setIsEdit(true)}>
                    {t('Edit')}
                  </Button>
                </div>
              )}
            </>
          )}
        </Form>
      </div>
    </>
  );
}
