import clsx from 'clsx';
import { memo, useMemo } from 'react';
import { useLanguage } from 'i18n';
import { LOCAL_LANGUAGE } from 'i18n/config';
import CustomSelect from 'pages/components/CustomSelect';

function LanguageMenu({ className }: { className?: string }) {
  const { language, changeLanguage } = useLanguage();

  const languageList = useMemo(
    () =>
      LOCAL_LANGUAGE.map((item) => ({
        value: item.language,
        children: item.title,
      })),
    [],
  );

  return (
    <div className={clsx('language-menu', className)}>
      <CustomSelect items={languageList} value={language} onChange={changeLanguage} style={{ width: '100%' }} />
    </div>
  );
}

export default memo(LanguageMenu);
