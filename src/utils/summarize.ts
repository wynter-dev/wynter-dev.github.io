export function summarize(content: string): string {
  let text: string = content;

  // 1) Markdown 이미지 제거: ![](url)
  text = text.replace(/!\[[^\]]*]\([^)]*\)/g, '');

  // 2) HTML <img> 태그 제거
  text = text.replace(/<img[^>]*>/g, '');

  // 3) <figure> 블록 전체 제거
  text = text.replace(/<figure[^>]*>[\s\S]*?<\/figure>/g, '');

  // 4) 이미지 placeholder 제거
  text = text.replace(/<div[^>]*data-image-empty[^>]*><\/div>/g, '');
  text = text.replace(/<!--\s*image-placeholder\s*-->/g, '');

  // 5) 코드 블록 제거: ``` ... ```
  text = text.replace(/```[\s\S]*?```/g, '');

  // 6) 인라인 코드 `code`
  text = text.replace(/`([^`]*)`/g, '$1');

  // 7) 헤딩 제거 (# ...)
  text = text.replace(/^#{1,6}\s.*$/gm, '');

  // 8) 인용문 제거 (> ...)
  text = text.replace(/^>\s?.*$/gm, '');

  // 9) 리스트 항목 제거 (- item, * item)
  text = text.replace(/[-*+]\s.+/gm, '');

  // 10) 취소선 ~~text~~
  text = text.replace(/~~([^~]+)~~/g, '$1');

  // 11) 링크 [text](url)
  text = text.replace(/\[([^\]]+)]\([^)]*\)/g, '$1');

  // 12) 마크다운/HTML 잔여 기호 제거
  text = text.replace(/[*_~`>|#-]+/g, ' ');

  // 13) 공백 정리
  text = text.replace(/\s+/g, ' ').trim();

  return text.length > 160 ? `${text.slice(0, 157)}...` : text;
}
