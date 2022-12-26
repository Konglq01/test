import { List, Modal } from 'antd';
import { ReactNode } from 'react';
import './index.less';

export default function CustomSelectModal({
  open,
  dataSource,
  render,
  onClose,
}: {
  open?: boolean;
  dataSource?: any[];
  render: (item: any) => ReactNode;
  onClose: () => void;
}) {
  return (
    <Modal
      className="custom-select-modal"
      onCancel={onClose}
      open={open}
      width={320}
      footer={<></>}
      title={<></>}
      closable={false}>
      <List>{dataSource?.map(render)}</List>
    </Modal>
  );
}
