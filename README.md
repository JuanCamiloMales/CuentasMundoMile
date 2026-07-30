# Revistas — Gestión de Deudas

Aplicación web móvil (PWA) con autenticación de Google y whitelist para gestionar clientes, pedidos, abonos y calcular saldos de forma colaborativa.

## Stack

- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** para estilos
- **Firebase Firestore + Authentication** (Google Sign-In, plan gratuito)
- **Clean Architecture** (Dominio · Infraestructura · Presentación)
- **Atomic Design** para componentes UI
- **PWA** instalable en el celular

## Configuración

### 1. Instala dependencias
```bash
npm install
```

### 2. Configura Firebase
- Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
- Habilita **Firestore Database** (modo producción)
- Habilita **Authentication → Sign-in method → Google**
- Copia `.env.example` a `.env` y completa las credenciales:
```bash
cp .env.example .env
```

### 3. Configura la whitelist
Crea en Firestore la colección `allowed_users/` con un documento por cada correo autorizado (el ID del documento debe ser el email en minúsculas):

```
allowed_users/
  └── camilomalez@gmail.com
        ├── email: "camilomalez@gmail.com"
        ├── displayName: "Camilo"
        ├── role: "admin"
        ├── addedAt: <timestamp>
        └── addedBy: "manual"
```

### 4. Despliega las reglas de seguridad
En Firebase Console → Firestore → Rules, pega el contenido de `firestore.rules` (incluido en la raíz del proyecto). Las reglas validan que `request.auth.token.email` exista en `allowed_users/`.

### 5. Levanta el servidor
```bash
npm run dev
```

## Estructura

```
src/
├── domain/                       → Entidades, interfaces, use cases (sin React/Firebase)
│   ├── entities/                 (Client, Order, Payment, AuthUser, ...)
│   ├── repositories/             (IClientRepository, IAuthRepository, ...)
│   └── usecases/
│       ├── clients/
│       ├── orders/
│       ├── payments/
│       ├── balance/
│       └── auth/                 (SignInWithGoogle, SignOut, SubscribeAuth, CheckEmailAllowed)
├── infrastructure/               → Implementaciones Firebase (Firestore + Auth)
└── presentation/                 → UI React (Atomic Design)
    ├── components/
    │   ├── atoms/                (Button, Input, Avatar, LoginButton, ...)
    │   ├── molecules/            (ClientListItem, BalanceCard, ...)
    │   ├── organisms/            (AuthGuard, UserMenu, ClientList, ...)
    │   ├── templates/            (MainLayout)
    │   └── pages/                (ClientsPage, LoginPage, ...)
    ├── hooks/                    (useClients, useAuth, ...)
    ├── di/container.ts           → Inyección de dependencias
    ├── utils/                    (formatters, helpers)
    └── router.tsx
```

## Flujo de autenticación

```
1. App carga → AuthGuard verifica auth state
2. No autenticado       → redirige a /login (botón Google)
3. Autenticado          → CheckEmailAllowed consulta allowed_users/{email}
4. Email en whitelist   → muestra MainLayout
5. Email NO en whitelist → pantalla "Acceso Denegado" + botón cerrar sesión
```

## Modelo de seguridad

- **Cliente (UX):** muestra pantallas apropiadas según el estado
- **Servidor (verdadera barrera):** `firestore.rules` bloquea reads/writes si el email no está en `allowed_users`
- **Gestión de whitelist:** solo desde Firebase Console — los clientes NUNCA pueden añadirse a sí mismos

## Comandos

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción (genera PWA en /dist)
npm run preview    # Preview del build de producción
npm run typecheck  # Solo verificación de tipos
```