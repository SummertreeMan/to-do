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

참고:

- `NEXT_PUBLIC_TODO_STORAGE` 값을 지정하지 않아도, `NEXT_PUBLIC_FIREBASE_*` 6개 값이 모두 존재하면 자동으로 `firebase` 저장소를 사용합니다.
- Vercel 배포에서 DB 저장이 필요하면 `NEXT_PUBLIC_TODO_STORAGE=firebase`를 명시하는 것을 권장합니다.

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

빠른 설정:

```bash
cp .env.local.example .env.local
```

## Firestore 데이터 구조 (인증 기반)

- 경로: `users/{uid}/todos/{todoId}`
- `uid`: Firebase Authentication 사용자 UID (익명 로그인 포함)
- `todoId`: 앱의 `todo.id`
- 문서 필드: `id`, `title`, `completed`, `createdAt`

## Firebase Auth (익명 로그인) 설정

이 앱은 Firebase 저장소 사용 시 자동으로 익명 로그인을 시도합니다.
Firebase Console에서 반드시 아래를 켜주세요.

1. Firebase Console > Authentication > Sign-in method
2. `익명(Anonymous)` 제공업체 활성화

## Firestore 보안 규칙 (강화)

프로젝트 루트의 `firestore.rules`를 사용합니다.
핵심 정책:

- 인증된 사용자만 접근 가능
- 본인 UID 경로(`users/{uid}`)에만 읽기/쓰기 가능
- To-do 필드 구조/타입 검증(`id`, `title`, `completed`, `createdAt`)

적용 방법:

```bash
firebase login
firebase use <your-project-id>
firebase deploy --only firestore:rules
```
