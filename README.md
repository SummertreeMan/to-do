# To-do App

개인용 To-do 앱입니다. 기본 저장소는 `localStorage`이며, 환경변수로 Firebase Firestore 저장을 사용할 수 있습니다.

## 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 확인.

## 테스트

```bash
npm run test
npm run lint
```

## 저장소 선택

기본값은 `localStorage`입니다.

- `NEXT_PUBLIC_TODO_STORAGE=localStorage` (기본)
- `NEXT_PUBLIC_TODO_STORAGE=firebase`

## Firebase 설정

1. Firebase Console에서 프로젝트 생성
2. Firestore Database 생성 (Native mode)
3. 웹 앱 등록 후 SDK 설정값 확보
4. 루트에 `.env.local` 생성

`.env.local` 예시:

```bash
NEXT_PUBLIC_TODO_STORAGE=firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## Firestore 데이터 구조

- 컬렉션: `todos`
- 문서 ID: `todo.id`
- 문서 필드: `id`, `title`, `completed`, `createdAt`

## Firestore 보안 규칙 (MVP 개발용)

로그인 기능이 아직 없으므로, 개발 단계에서는 테스트용으로만 아래 규칙을 사용하세요.

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{todoId} {
      allow read, write: if true;
    }
  }
}
```

운영에서는 인증 도입 후 규칙을 반드시 제한해야 합니다.
