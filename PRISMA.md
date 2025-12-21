# 📚 Guide des Types Prisma Utiles

## 🎯 Les 5 Types Essentiels

### 1. **`Prisma.UserGetPayload<>`** - Type avec relations
Le plus important ! Permet d'obtenir le type exact d'une requête avec `include` ou `select`.

```typescript
import { Prisma } from '@prisma/client';

// User avec relation member
type UserWithMember = Prisma.UserGetPayload<{
  include: { member: true }
}>;

// User avec plusieurs relations
type UserWithAll = Prisma.UserGetPayload<{
  include: { 
    member: true,
    posts: true,
    comments: { include: { author: true } }
  }
}>;

// User avec sélection partielle
type UserPublic = Prisma.UserGetPayload<{
  select: {
    id: true,
    email: true,
    username: true
  }
}>;
```

**Utilisation dans vos classes** :
```typescript
type UserWithMember = Prisma.UserGetPayload<{
  include: { member: true }
}>;

export interface UserClient extends UserWithMember {}

export class UserClient {
  constructor(data: UserWithMember) {
    Object.assign(this, data);
  }
  
  // Vos méthodes...
}
```

---

### 2. **`Prisma.UserCreateInput`** - Pour la création (DTOs)
Type pour les données nécessaires à la création d'un User.

```typescript
import { Prisma } from '@prisma/client';

// DTO de création
export class CreateUserDto implements Prisma.UserCreateInput {
  email: string;
  username: string;
  password: string;
  
  // Relations optionnelles
  member?: Prisma.MemberCreateNestedOneWithoutUserInput;
}
```

**Utile pour** : DTOs de création, validation des inputs

---

### 3. **`Prisma.UserUpdateInput`** - Pour la mise à jour (DTOs)
Type pour les données de mise à jour d'un User.

```typescript
import { Prisma } from '@prisma/client';

// DTO de mise à jour
export class UpdateUserDto implements Partial<Prisma.UserUpdateInput> {
  email?: string;
  username?: string;
  
  member?: Prisma.MemberUpdateOneWithoutUserNestedInput;
}
```

**Utile pour** : DTOs de mise à jour, modifications partielles

---

### 4. **`Prisma.UserWhereInput`** - Pour les filtres
Type pour filtrer les Users dans les requêtes.

```typescript
import { Prisma } from '@prisma/client';

// Fonction de recherche
async function searchUsers(filters: Prisma.UserWhereInput) {
  return prisma.user.findMany({ where: filters });
}

// Utilisation
searchUsers({
  email: { contains: '@gmail.com' },
  member: { 
    familyId: 5,
    role: 'ADMIN'
  }
});
```

**Utile pour** : Fonctions de recherche, filtres complexes

---

### 5. **`Prisma.UserWhereUniqueInput`** - Pour identifier un User unique
Type pour identifier un User par ses champs uniques.

```typescript
import { Prisma } from '@prisma/client';

async function findUser(where: Prisma.UserWhereUniqueInput) {
  return prisma.user.findUnique({ where });
}

// Utilisation
findUser({ id: 1 });
findUser({ email: 'john@example.com' });
```

**Utile pour** : findUnique, update, delete

---

## 🛠️ Types Supplémentaires Utiles

### **`Prisma.UserOrderByWithRelationInput`** - Pour le tri
```typescript
const users = await prisma.user.findMany({
  orderBy: { createdAt: 'desc' } satisfies Prisma.UserOrderByWithRelationInput
});
```

### **`Prisma.UserSelect`** - Pour select typé
```typescript
const userSelect = {
  id: true,
  email: true,
  member: { select: { role: true } }
} satisfies Prisma.UserSelect;
```

### **`Prisma.UserInclude`** - Pour include typé
```typescript
const userInclude = {
  member: true,
  posts: { take: 5 }
} satisfies Prisma.UserInclude;
```

---

## 🎨 Patterns Pratiques

### Pattern 1 : Classe Entity avec relations
```typescript
import { Prisma } from '@prisma/client';

type UserWithMember = Prisma.UserGetPayload<{
  include: { member: true }
}>;

export interface UserClient extends UserWithMember {}

export class UserClient {
  constructor(data: UserWithMember) {
    Object.assign(this, data);
  }

  get role() {
    return this.member?.role ?? null;
  }
}
```

### Pattern 2 : DTO avec validation
```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateUserDto implements Prisma.UserCreateInput {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

### Pattern 3 : Types dérivés personnalisés
```typescript
import { Prisma, User } from '@prisma/client';

// Sans password
export type UserPublic = Omit<User, 'password'>;

// Avec relations spécifiques
export type UserWithFamily = Prisma.UserGetPayload<{
  include: { 
    member: { 
      include: { family: true } 
    }
  }
}>;

// Sélection custom
export type UserBasicInfo = Pick<User, 'id' | 'email' | 'username'>;
```

### Pattern 4 : Service avec types corrects
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UserClient } from './entities/user-client.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<UserClient> {
    const user = await this.prisma.user.create({
      data,
      include: { member: true }
    });
    return new UserClient(user);
  }

  async findOne(where: Prisma.UserWhereUniqueInput): Promise<UserClient | null> {
    const user = await this.prisma.user.findUnique({
      where,
      include: { member: true }
    });
    if (!user) return null;
    return new UserClient(user);
  }

  async findMany(where?: Prisma.UserWhereInput): Promise<UserClient[]> {
    const users = await this.prisma.user.findMany({
      where,
      include: { member: true }
    });
    return users.map(user => new UserClient(user));
  }
}
```

---

## 📋 Cheat Sheet Rapide

| Besoin                    | Type Prisma                       | Exemple                                 |
|---------------------------|-----------------------------------|-----------------------------------------|
| **Classe avec relations** | `Prisma.XxxGetPayload<{include}>` | Entity classes                          |
| **DTO création**          | `Prisma.XxxCreateInput`           | CreateUserDto                           |
| **DTO mise à jour**       | `Prisma.XxxUpdateInput`           | UpdateUserDto                           |
| **Filtrer**               | `Prisma.XxxWhereInput`            | Search functions                        |
| **Identifier**            | `Prisma.XxxWhereUniqueInput`      | findOne, update                         |
| **Trier**                 | `Prisma.XxxOrderByInput`          | orderBy queries                         |
| **Type de base**          | Import direct                     | `import { User } from '@prisma/client'` |

---

## 💡 Conseils Pro

1. **Toujours typer vos requêtes Prisma** — utilisez `satisfies` pour la validation
2. **Créez des types réutilisables** dans un fichier `types/xxx.types.ts`
3. **Utilisez `Omit`/`Pick`** pour créer des variantes (UserPublic, UserBasic)
4. **Préférez `GetPayload`** aux types manuels pour les relations
5. **Ne réinventez pas la roue** - Prisma génère déjà ce dont vous avez besoin !

---

## 🚀 Commande utile

Après chaque modification du schema Prisma :
```bash
npx prisma generate
```

Cela régénère tous les types automatiquement ! ✨