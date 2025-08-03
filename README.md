# 🧳 TripMate - Frontend

**TripMate**는 AI 기반으로 여행 일정을 자동 생성하고, 동행자와 협업하여 계획을 실시간으로 공유·수정할 수 있는 여행 플랫폼입니다.  
이 저장소는 TripMate의 **프론트엔드** 레포지토리이며, React를 기반으로 구축되었습니다.

---

## 🚀 Features

- 🔐 **Social Login**  
  Google / Naver / Kakao OAuth2 기반 로그인 및 회원가입 지원

- 🤖 **AI 여행 일정 추천**  
  사용자의 지역, 날짜, 여행 스타일에 따라 Gemini API 기반 자동 일정 생성

- 🏠 **여행 계획 방(Room) 시스템**  
  일정을 공유하고 동행자와 함께 실시간으로 수정 가능한 협업 공간

- 💬 **장소 댓글 기능**  
  각 일정 장소에 대한 의견을 댓글로 작성 및 공유 가능

- 📰 **커뮤니티 게시판**  
  여행 정보 공유용 포스트 작성, 목록 조회, 좋아요 기능

- 🧑‍💼 **마이페이지**  
  내가 생성한 일정, 좋아요한 포스트 등 개인 활동 관리

---

## 🖼 UI Previews

| 메인 페이지 | 여행 생성 Flow | 여행 계획 방 |
|-------------|----------------|---------------|
| `MainPage.jsx` | 목적지 → 스타일 → 날짜 → 결과 | `RoomPage.jsx` |

| 게시판 | 마이페이지 |
|--------|------------|
| 글 목록, 작성, 좋아요 | 나의 일정 / 좋아요한 게시글 |

### ➡️ 메인 페이지
<img width="1215" height="801" alt="Image" src="https://github.com/user-attachments/assets/70841718-0101-43b3-b1ea-3967f6978c36" />

### ➡️ 여행 생성 Flow
<img width="1212" height="820" alt="Image" src="https://github.com/user-attachments/assets/591dac41-7778-4f07-a44d-c8413c581afe" />
<img width="1192" height="573" alt="Image" src="https://github.com/user-attachments/assets/9acc1b1d-1208-4966-b9d4-777652bb471f" />
<img width="1212" height="717" alt="Image" src="https://github.com/user-attachments/assets/158a0fdd-b636-4a8d-83ce-fb5585b93dfc" />
<img width="1182" height="849" alt="Image" src="https://github.com/user-attachments/assets/e0a39a42-c9d2-4713-b69a-149359c4edc6" />

### ➡️ 여행 계획 방
<img width="2509" height="1315" alt="Image" src="https://github.com/user-attachments/assets/77fd6abb-dbfb-4b13-871e-2872933603a0" />

### ➡️ 게시판
<img width="1783" height="1221" alt="Image" src="https://github.com/user-attachments/assets/bcaa592d-dbb3-4986-9f99-14abcbf2f309" />
<img width="2529" height="1308" alt="Image" src="https://github.com/user-attachments/assets/d9bb8bfd-6989-4d65-a9b8-140a568e9663" />

### ➡️ 마이페이지
<img width="720" height="391" alt="Image" src="https://github.com/user-attachments/assets/d2d8981e-b20a-4e74-84ae-b6de75ae7f51" />
---

## 🛠 Tech Stack

| Category       | Tech                                               |
|----------------|----------------------------------------------------|
| **Frontend**   | React, JavaScript, HTML, CSS                       |
| **UI Routing** | React Router                                       |
| **State Mgmt** | React Hooks (useState, useEffect)                 |
| **API Comm.**  | Axios                                              |
| **OAuth**      | OAuth2 Redirect Flow (Google, Kakao, Naver)       |

---

## ⚙️ 설치 및 실행

```bash
# 1. 패키지 설치
npm install

# 2. 개발 서버 실행
npm run dev

