/**
 * 이 함수는 두 문자열 간의 차이를 계산합니다.
 * 두 문자열 사이에 한 번의 연산(삽입, 삭제, 교체)만 수행되었다고 가정합니다.
 *
 * 두 문자열의 가장 긴 공통 접두사와 접미사를 찾는 방식으로 동작합니다.
 * 삭제된 부분 문자열의 시작 인덱스와 길이를 반환합니다.
 * 삽입된 내용이 있다면 그것도 함께 반환합니다.
 *
 * 한 번의 연산이란 다음 중 하나를 의미합니다:
 * - 기존 문자열을 삭제하지 않고 부분 문자열을 삽입
 * - 부분 문자열을 삭제
 * - 부분 문자열을 다른 문자열로 교체
 * (부분 문자열이란 문자열 내 연속된 부분을 의미합니다)
 *
 * @param previousString 수정되기 전의 문자열
 * @param newString 수정된 문자열
 * @returns {removeFrom: number, removeLength: number, insertedContent?: string}
 *        <pre>
 *        removeFrom: 삭제된 부분 문자열의 시작 인덱스 (previousString 에서의 위치)
 *        removeLength: 삭제된 부분 문자열의 길이
 *        insertedContent: 삽입된 내용 (있다면)
 *        </pre>
 */
const getDiff = (previousString: string, newString: string): {removeFrom: number, removeLength: number, insertedContent?: string} => {
  let removeFrom = 0;
  let removeEnd = previousString.length - 1;
  while (removeFrom < previousString.length && removeFrom < newString.length && previousString[removeFrom] === newString[removeFrom]) {
    removeFrom++;
  }
  removeEnd = previousString.length - 1;
  for (let i = newString.length - 1; removeEnd >= 0 && i >= 0; i--) {
    if (previousString[removeEnd] !== newString[i])
        break;
    removeEnd--;
  }

  let removeLength = 0;
  if (newString.length < previousString.length || removeEnd >= removeFrom) {
    if (removeEnd < removeFrom) {
      removeLength = previousString.length - newString.length;
    } else {
      removeLength = removeEnd - removeFrom + 1;
    }
  }

  let insertedContent = undefined;
  if (removeLength === 0) {
    if (newString.length !== previousString.length)
      insertedContent = newString.slice(removeFrom, removeFrom + newString.length - previousString.length);
  } else {
    if (removeLength + newString.length !== previousString.length)
      insertedContent = newString.slice(removeFrom, removeFrom + newString.length - previousString.length + removeLength);
  }
  return {
      removeFrom,
      removeLength,
      insertedContent
  };
}

export default getDiff;