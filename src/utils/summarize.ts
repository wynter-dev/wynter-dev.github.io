export function summarize(content: string): string {
  let text: string = content;

  // 1) Markdown 이미지 제거: ![](url)
  text = text.replace(/!\[[^\]]*]\([^)]*\)/g, '');

  // 2) HTML <img> 태그 제거
  text = text.replace(/<img[^>]*>/g, '');

  // 3) 이미지 placeholder 제거
  text = text.replace(/<div[^>]*data-image-empty[^>]*><\/div>/g, '');
  text = text.replace(/<!--\s*image-placeholder\s*-->/g, '');

  // 4) 코드 블록 제거: ``` ... ```
  text = text.replace(/```[\s\S]*?```/g, '');

  // 5) 인라인 코드 `code`
  text = text.replace(/`([^`]*)`/g, '$1');

  // 6) 헤딩 제거 (# ...)
  text = text.replace(/^#{1,6}\s.*$/gm, '');

  // 7) 인용문 제거 (> ...)
  text = text.replace(/^>\s?.*$/gm, '');

  // 8) 리스트 항목 제거 (- item, * item)
  text = text.replace(/[-*+]\s.+/gm, '');

  // 9) 취소선 ~~text~~
  text = text.replace(/~~([^~]+)~~/g, '$1');

  // 10) 링크 [text](url)
  text = text.replace(/\[([^\]]+)]\([^)]*\)/g, '$1');

  // 11) HTML 태그 전체 제거 <tag>...</tag> , <tag/>
  text = text.replace(/<\/?[^>]+>/g, '');

  // 12) 마크다운/HTML 잔여 기호 제거
  text = text.replace(/[*_~`>|#-]+/g, ' ');

  // 13) 공백 정리
  text = text.replace(/\s+/g, ' ').trim();

  return text.length > 160 ? `${text.slice(0, 157)}...` : text;
}
