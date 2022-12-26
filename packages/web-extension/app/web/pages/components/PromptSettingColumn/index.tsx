import clsx from 'clsx';
import { ReactNode } from 'react';
import './index.less';

export interface PromptSettingColumnProps {
  title?: ReactNode;
  header?: ReactNode;
  className?: string;
  children?: ReactNode;
  rightElement?: ReactNode;
}

export default function PromptSettingColumn({
  title,
  header,
  className,
  children,
  rightElement,
}: PromptSettingColumnProps) {
  return (
    <div className={clsx('prompt-setting-column', className)}>
      {header || <div className="prompt-setting-header">{title || ''}</div>}

      <div className="prompt-setting-column-content">
        <div
          className={clsx(
            'prompt-setting-column-box prompt-setting-column-box-left',
            !rightElement && 'prompt-setting-box-full',
          )}>
          {children}
        </div>
        {rightElement && (
          <>
            <div className="prompt-setting-column-slice"></div>
            <div className="prompt-setting-column-box prompt-setting-column-box-right">{rightElement}</div>
          </>
        )}
      </div>
    </div>
  );
}
