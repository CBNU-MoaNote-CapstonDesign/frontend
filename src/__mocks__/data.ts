import {Note} from "@/types/note";
import {Diagram} from "@/types/diagram";

export const testData: Array<Note> = [
  {
    id: "245c792b-c156-4e32-874b-eb0186a06840",
    title: "내 문서 1",
    content: "# 문서1의 내용\n* 마크다운 서식 테스트\n\n내용 테스트"
  },
  {
    title: "내 문서 2",
    id: "23942e5e-0399-4c08-bab5-b775938a2952",
    content: "# 문서2의 내용\n* 마크다운 서식 테스트\n\n내용 테스트"
  },
  {
    title: "내 문서 3",
    id: "2448cea4-66c8-488b-89af-122c3006212b",
    content: "# 문서3의 내용\n* 마크다운 서식 테스트\n\n내용 테스트"
  },
  {
    title: "내 문서 4",
    id: "75551b52-6d2e-4f8f-bc00-22f7447990d3",
    content: "# 문서4의 내용\n* 마크다운 서식 테스트\n\n내용 테스트"
  }];

export const testUser: Array<User> = [
  {
    id: "23942e5e-0399-4c08-bab5-b775938a2951",
    name: "kim"
  },
  {
    id: "23942e5e-0399-4c08-bab5-b175938a2951",
    name: "sa"
  },
  {
    id: "83942e5e-0399-4c08-bab5-b775938a2951",
    name: "son"
  },
  {
    id: "moa-bot-id",
    name: "Moa Bot"
  }
];

export const testDiagram: Array<Diagram> = [
  {
    uuid: "23942d5e-0399-4c08-bab5-b175938a2951",
    title: "테스트 Diagram 1",
    elements: [
      
    ]
  }
];