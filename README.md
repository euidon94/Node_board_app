# Node_board_app

Node.js(Express)와 React, MongoDB를 활용한 게시판 웹 애플리케이션입니다.

---

## 목차

- [기능 소개](#기능-소개)
- [기술 스택](#기술-스택)
- [실행 방법](#실행-방법)
- [프로젝트 구조](#프로젝트-구조)
- [기본 계정 정보](#기본-계정-정보)
- [기타](#기타)
- [Github](#github)

---

## 기능 소개

### 게시판 기능
- 게시글 CRUD (작성, 조회, 수정, 삭제)
- 페이지네이션 지원
- 게시글 파일 첨부 기능
- 댓글 시스템 (작성, 조회, 삭제)
- 게시글/댓글 검색

### 계정 기능
- 회원가입 및 로그인 (JWT 인증)
- 권한별 접근 제어 (일반 사용자, 관리자)

---

## 기술 스택

### 백엔드
- Node.js (v18+)
- Express.js
- Mongoose (MongoDB ODM)
- MongoDB

### 프론트엔드
- React (CRA 기반)
- Axios
- CSS3

### 개발 도구 및 환경
- Docker & Docker Compose
- Git

---

## 실행 방법

### 사전 요구사항
- Docker Desktop 설치
- Git 설치

### Docker Compose를 활용한 실행 방법

1. 프로젝트 클론
    ```
    git clone https://github.com/euidon94/Node_board_app.git
    cd Node_board_app
    ```

2. Docker Compose로 실행
    ```
    docker-compose up --build
    ```

3. 브라우저에서 접속  
    - 프론트엔드: [http://localhost:3000](http://localhost:3000)
    - 백엔드 API: [http://localhost:5000](http://localhost:5000)

4. 종료하기
    ```
    docker-compose down
    ```

#### Docker Compose 수정 후 적용 방법

- 코드 수정 후 재빌드 및 재시작
    ```
    docker-compose down
    docker-compose up --build
    ```

#### 볼륨 및 데이터 관리

- MongoDB 데이터는 Docker 볼륨(`mongo-data`)을 통해 보존됩니다.
- 업로드 파일은 `/backend/uploads` 디렉토리에 저장됩니다.

---

## 프로젝트 구조

Node_board_app/
├── backend/ # Node.js Express 백엔드
│ ├── uploads/ # 업로드 파일 저장 디렉토리
│ ├── models/ # Mongoose 모델
│ ├── routes/ # API 라우터
│ ├── controllers/ # 비즈니스 로직
│ ├── app.js # Express 앱 진입점
│ └── Dockerfile # 백엔드 Docker 빌드 설정
├── frontend/ # React 프론트엔드
│ ├── src/
│ ├── public/
│ └── Dockerfile # 프론트엔드 Docker 빌드 설정
├── docker-compose.yml # Docker Compose 설정
└── README.md # 프로젝트 설명


---

## 기본 계정 정보

> **시스템 시작 시 자동 생성되는 기본 계정**

| 역할      | ID       | 비밀번호  |
|-----------|----------|-----------|
| 관리자    | admin    | admin123  |
| 일반유저  | user     | user123   |

- 관리자는 모든 게시글 및 댓글에 대한 수정/삭제 권한을 가집니다.

---

## 기타

- DB 관리가 필요할 경우:
    ```
    docker exec -it <mongo-container-id> mongosh
    use board
    db.users.find()
    ```
- 업로드 파일 확인:
    ```
    docker exec -it <backend-container-id> /bin/bash
    cd uploads
    ls -l
    ```

---

## Github

- [https://github.com/euidon94/Node_board_app](https://github.com/euidon94/Node_board_app)

---

**문의 및 개선 제안은 Issue로 남겨주세요!**
