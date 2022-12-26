export const errorToReload = (
  <>
    Something&apos;s gone wrong. Try reloading the page or&nbsp;
    <span style={{ color: '#5b8ef4', cursor: 'pointer' }} onClick={() => chrome.runtime.reload()}>
      reloading the portkey
    </span>
    .
  </>
);
