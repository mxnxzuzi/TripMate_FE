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
<img width="783" height="408" alt="Image" src="https://github.com/user-attachments/assets/99954af2-feb1-4416-bda2-1a66f6b01113" />

### ➡️ 여행 생성 Flow
<img width="785" height="407" alt="Image" src="https://github.com/user-attachments/assets/01e349af-2bf9-4dd5-ae0b-12ce848b2ba2" />
<img width="785" height="402" alt="Image" src="https://github.com/user-attachments/assets/fb79f7f8-17f4-4b40-8f55-efe653a74146" />
<img width="1137" height="582" alt="Image" src="https://github.com/user-attachments/assets/da61240d-e4ad-42ea-873e-fbfa9de9b761" />
<img width="1132" height="576" alt="Image" src="https://github.com/user-attachments/assets/ef3e1922-eb16-437b-80c6-445c0911983d" />

### ➡️ 여행 계획 방
<img width="839" height="582" alt="Image" src="https://github.com/user-attachments/assets/49cb7c24-fd1f-4fd3-92c6-ea66b7f24613" />

### ➡️ 게시판
<img width="1135" height="591" alt="Image" src="https://github.com/user-attachments/assets/f2a7d3ed-673d-4841-8602-75f4bcb34a2d" />
<img width="1102" height="595" alt="Image" src="https://github.com/user-attachments/assets/a803ada0-4102-4f2a-9dc6-ff4b902b8af9" />

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

