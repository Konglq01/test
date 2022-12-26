import { Button, Tag } from 'antd';
import clsx from 'clsx';
import CustomSvg from 'components/CustomSvg';
import { MouseEventHandler, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './index.less';

const { CheckableTag } = Tag;
interface TabItem {
  value: string;
  key: number;
}
export default function ConfirmMnemonic({
  mnemonic,
  onConfirm,
}: {
  mnemonic: string;
  onConfirm?: MouseEventHandler<HTMLElement>;
}) {
  const { t } = useTranslation();

  const [selectedTags, setSelectedTags] = useState<TabItem[]>([]);
  const sortMnemonic: TabItem[] = useMemo(
    () =>
      mnemonic
        .split(' ')
        .sort(() => 0.5 - Math.random())
        .map((item, index) => ({ value: item, key: index })),
    [mnemonic],
  );
  const onClose = useCallback((tag: TabItem) => setSelectedTags((v) => v.filter((item) => item.key !== tag.key)), []);

  const handleChange = useCallback(
    (tag: TabItem, checked: boolean) => {
      const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter((t) => t.key !== tag.key);
      setSelectedTags(nextSelectedTags);
    },
    [selectedTags],
  );

  const isError = useMemo(
    () => selectedTags.map((item) => item.value).join(' ') !== mnemonic && selectedTags.length === sortMnemonic.length,
    [mnemonic, selectedTags, sortMnemonic.length],
  );

  return (
    <div className="backup-content confirm-mnemonic-content">
      <div className="title">{t('Confirm Secret Recovery Phrase')}</div>
      <p className="description">{t('Please select the words in the right order')}</p>
      <div
        className="confirm-mnemonic-container"
        style={{ paddingTop: selectedTags.length === sortMnemonic.length ? '14px' : '16px' }}>
        {selectedTags.map((tag) => (
          <Tag key={tag.key} onClick={() => onClose(tag)}>
            {tag.value}
          </Tag>
        ))}
      </div>
      <div className="tip-recover-container">
        {selectedTags.length > 0 && <div className="error-tip">{isError && t('Invalid Secret Recovery Phrase')}</div>}
        {selectedTags.length > 0 && (
          <div className="flex-row-center recover-wrapper" onClick={() => setSelectedTags([])}>
            <CustomSvg type="Recover" />
            {t('Clear')}
          </div>
        )}
      </div>
      <div className="mnemonic-tag-wrapper" style={{ marginTop: selectedTags.length > 0 ? 24 : 32 }}>
        {sortMnemonic.map((tag) => (
          <CheckableTag
            key={tag.key}
            checked={!!selectedTags.find((item) => tag.key === item.key)}
            onChange={(checked) => handleChange(tag, checked)}>
            {tag.value}
          </CheckableTag>
        ))}
      </div>
      <Button
        className="submit-btn"
        disabled={selectedTags.map((item) => item.value).join(' ') !== mnemonic}
        type="primary"
        onClick={onConfirm}>
        {t('Confirm')}
      </Button>
    </div>
  );
}
