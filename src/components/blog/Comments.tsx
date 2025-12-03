'use client';

import Giscus from '@giscus/react';
import {useTheme} from 'next-themes';

export default function Comments() {
  const {resolvedTheme} = useTheme();

  return (
    <div className="mt-5">
      <Giscus
        id="comments"
        repo="wynter-dev/wynter-blog"
        repoId="R_kgDOQZYZeg"
        category="Announcements"
        categoryId="DIC_kwDOQZYZes4CzEqH"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={resolvedTheme}
        lang="ko"
        loading="lazy"
      />
    </div>
  );
}
