
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model Restaurant
 * 
 */
export type Restaurant = $Result.DefaultSelection<Prisma.$RestaurantPayload>
/**
 * Model Location
 * 
 */
export type Location = $Result.DefaultSelection<Prisma.$LocationPayload>
/**
 * Model Reservierung
 * 
 */
export type Reservierung = $Result.DefaultSelection<Prisma.$ReservierungPayload>
/**
 * Model Menu
 * 
 */
export type Menu = $Result.DefaultSelection<Prisma.$MenuPayload>
/**
 * Model Kategorie
 * 
 */
export type Kategorie = $Result.DefaultSelection<Prisma.$KategoriePayload>
/**
 * Model Gericht
 * 
 */
export type Gericht = $Result.DefaultSelection<Prisma.$GerichtPayload>
/**
 * Model Zutat
 * 
 */
export type Zutat = $Result.DefaultSelection<Prisma.$ZutatPayload>
/**
 * Model Bewertung
 * 
 */
export type Bewertung = $Result.DefaultSelection<Prisma.$BewertungPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  User: 'User',
  Admin: 'Admin',
  Owner: 'Owner'
};

export type Role = (typeof Role)[keyof typeof Role]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.restaurant`: Exposes CRUD operations for the **Restaurant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Restaurants
    * const restaurants = await prisma.restaurant.findMany()
    * ```
    */
  get restaurant(): Prisma.RestaurantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.location`: Exposes CRUD operations for the **Location** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Locations
    * const locations = await prisma.location.findMany()
    * ```
    */
  get location(): Prisma.LocationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.reservierung`: Exposes CRUD operations for the **Reservierung** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reservierungs
    * const reservierungs = await prisma.reservierung.findMany()
    * ```
    */
  get reservierung(): Prisma.ReservierungDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.menu`: Exposes CRUD operations for the **Menu** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Menus
    * const menus = await prisma.menu.findMany()
    * ```
    */
  get menu(): Prisma.MenuDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.kategorie`: Exposes CRUD operations for the **Kategorie** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Kategories
    * const kategories = await prisma.kategorie.findMany()
    * ```
    */
  get kategorie(): Prisma.KategorieDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gericht`: Exposes CRUD operations for the **Gericht** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Gerichts
    * const gerichts = await prisma.gericht.findMany()
    * ```
    */
  get gericht(): Prisma.GerichtDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.zutat`: Exposes CRUD operations for the **Zutat** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Zutats
    * const zutats = await prisma.zutat.findMany()
    * ```
    */
  get zutat(): Prisma.ZutatDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.bewertung`: Exposes CRUD operations for the **Bewertung** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Bewertungs
    * const bewertungs = await prisma.bewertung.findMany()
    * ```
    */
  get bewertung(): Prisma.BewertungDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Session: 'Session',
    Restaurant: 'Restaurant',
    Location: 'Location',
    Reservierung: 'Reservierung',
    Menu: 'Menu',
    Kategorie: 'Kategorie',
    Gericht: 'Gericht',
    Zutat: 'Zutat',
    Bewertung: 'Bewertung'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "session" | "restaurant" | "location" | "reservierung" | "menu" | "kategorie" | "gericht" | "zutat" | "bewertung"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      Restaurant: {
        payload: Prisma.$RestaurantPayload<ExtArgs>
        fields: Prisma.RestaurantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RestaurantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RestaurantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantPayload>
          }
          findFirst: {
            args: Prisma.RestaurantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RestaurantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantPayload>
          }
          findMany: {
            args: Prisma.RestaurantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantPayload>[]
          }
          create: {
            args: Prisma.RestaurantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantPayload>
          }
          createMany: {
            args: Prisma.RestaurantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.RestaurantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantPayload>
          }
          update: {
            args: Prisma.RestaurantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantPayload>
          }
          deleteMany: {
            args: Prisma.RestaurantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RestaurantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RestaurantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RestaurantPayload>
          }
          aggregate: {
            args: Prisma.RestaurantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRestaurant>
          }
          groupBy: {
            args: Prisma.RestaurantGroupByArgs<ExtArgs>
            result: $Utils.Optional<RestaurantGroupByOutputType>[]
          }
          count: {
            args: Prisma.RestaurantCountArgs<ExtArgs>
            result: $Utils.Optional<RestaurantCountAggregateOutputType> | number
          }
        }
      }
      Location: {
        payload: Prisma.$LocationPayload<ExtArgs>
        fields: Prisma.LocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          findFirst: {
            args: Prisma.LocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          findMany: {
            args: Prisma.LocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>[]
          }
          create: {
            args: Prisma.LocationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          createMany: {
            args: Prisma.LocationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          update: {
            args: Prisma.LocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          deleteMany: {
            args: Prisma.LocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LocationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          aggregate: {
            args: Prisma.LocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocation>
          }
          groupBy: {
            args: Prisma.LocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocationGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocationCountArgs<ExtArgs>
            result: $Utils.Optional<LocationCountAggregateOutputType> | number
          }
        }
      }
      Reservierung: {
        payload: Prisma.$ReservierungPayload<ExtArgs>
        fields: Prisma.ReservierungFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReservierungFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservierungPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReservierungFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservierungPayload>
          }
          findFirst: {
            args: Prisma.ReservierungFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservierungPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReservierungFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservierungPayload>
          }
          findMany: {
            args: Prisma.ReservierungFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservierungPayload>[]
          }
          create: {
            args: Prisma.ReservierungCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservierungPayload>
          }
          createMany: {
            args: Prisma.ReservierungCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ReservierungDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservierungPayload>
          }
          update: {
            args: Prisma.ReservierungUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservierungPayload>
          }
          deleteMany: {
            args: Prisma.ReservierungDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReservierungUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReservierungUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReservierungPayload>
          }
          aggregate: {
            args: Prisma.ReservierungAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReservierung>
          }
          groupBy: {
            args: Prisma.ReservierungGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReservierungGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReservierungCountArgs<ExtArgs>
            result: $Utils.Optional<ReservierungCountAggregateOutputType> | number
          }
        }
      }
      Menu: {
        payload: Prisma.$MenuPayload<ExtArgs>
        fields: Prisma.MenuFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MenuFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MenuFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuPayload>
          }
          findFirst: {
            args: Prisma.MenuFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MenuFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuPayload>
          }
          findMany: {
            args: Prisma.MenuFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuPayload>[]
          }
          create: {
            args: Prisma.MenuCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuPayload>
          }
          createMany: {
            args: Prisma.MenuCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.MenuDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuPayload>
          }
          update: {
            args: Prisma.MenuUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuPayload>
          }
          deleteMany: {
            args: Prisma.MenuDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MenuUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.MenuUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MenuPayload>
          }
          aggregate: {
            args: Prisma.MenuAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMenu>
          }
          groupBy: {
            args: Prisma.MenuGroupByArgs<ExtArgs>
            result: $Utils.Optional<MenuGroupByOutputType>[]
          }
          count: {
            args: Prisma.MenuCountArgs<ExtArgs>
            result: $Utils.Optional<MenuCountAggregateOutputType> | number
          }
        }
      }
      Kategorie: {
        payload: Prisma.$KategoriePayload<ExtArgs>
        fields: Prisma.KategorieFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KategorieFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KategoriePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KategorieFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KategoriePayload>
          }
          findFirst: {
            args: Prisma.KategorieFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KategoriePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KategorieFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KategoriePayload>
          }
          findMany: {
            args: Prisma.KategorieFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KategoriePayload>[]
          }
          create: {
            args: Prisma.KategorieCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KategoriePayload>
          }
          createMany: {
            args: Prisma.KategorieCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.KategorieDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KategoriePayload>
          }
          update: {
            args: Prisma.KategorieUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KategoriePayload>
          }
          deleteMany: {
            args: Prisma.KategorieDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KategorieUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.KategorieUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KategoriePayload>
          }
          aggregate: {
            args: Prisma.KategorieAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKategorie>
          }
          groupBy: {
            args: Prisma.KategorieGroupByArgs<ExtArgs>
            result: $Utils.Optional<KategorieGroupByOutputType>[]
          }
          count: {
            args: Prisma.KategorieCountArgs<ExtArgs>
            result: $Utils.Optional<KategorieCountAggregateOutputType> | number
          }
        }
      }
      Gericht: {
        payload: Prisma.$GerichtPayload<ExtArgs>
        fields: Prisma.GerichtFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GerichtFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GerichtPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GerichtFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GerichtPayload>
          }
          findFirst: {
            args: Prisma.GerichtFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GerichtPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GerichtFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GerichtPayload>
          }
          findMany: {
            args: Prisma.GerichtFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GerichtPayload>[]
          }
          create: {
            args: Prisma.GerichtCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GerichtPayload>
          }
          createMany: {
            args: Prisma.GerichtCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.GerichtDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GerichtPayload>
          }
          update: {
            args: Prisma.GerichtUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GerichtPayload>
          }
          deleteMany: {
            args: Prisma.GerichtDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GerichtUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GerichtUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GerichtPayload>
          }
          aggregate: {
            args: Prisma.GerichtAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGericht>
          }
          groupBy: {
            args: Prisma.GerichtGroupByArgs<ExtArgs>
            result: $Utils.Optional<GerichtGroupByOutputType>[]
          }
          count: {
            args: Prisma.GerichtCountArgs<ExtArgs>
            result: $Utils.Optional<GerichtCountAggregateOutputType> | number
          }
        }
      }
      Zutat: {
        payload: Prisma.$ZutatPayload<ExtArgs>
        fields: Prisma.ZutatFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ZutatFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZutatPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ZutatFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZutatPayload>
          }
          findFirst: {
            args: Prisma.ZutatFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZutatPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ZutatFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZutatPayload>
          }
          findMany: {
            args: Prisma.ZutatFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZutatPayload>[]
          }
          create: {
            args: Prisma.ZutatCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZutatPayload>
          }
          createMany: {
            args: Prisma.ZutatCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ZutatDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZutatPayload>
          }
          update: {
            args: Prisma.ZutatUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZutatPayload>
          }
          deleteMany: {
            args: Prisma.ZutatDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ZutatUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ZutatUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ZutatPayload>
          }
          aggregate: {
            args: Prisma.ZutatAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateZutat>
          }
          groupBy: {
            args: Prisma.ZutatGroupByArgs<ExtArgs>
            result: $Utils.Optional<ZutatGroupByOutputType>[]
          }
          count: {
            args: Prisma.ZutatCountArgs<ExtArgs>
            result: $Utils.Optional<ZutatCountAggregateOutputType> | number
          }
        }
      }
      Bewertung: {
        payload: Prisma.$BewertungPayload<ExtArgs>
        fields: Prisma.BewertungFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BewertungFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BewertungPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BewertungFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BewertungPayload>
          }
          findFirst: {
            args: Prisma.BewertungFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BewertungPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BewertungFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BewertungPayload>
          }
          findMany: {
            args: Prisma.BewertungFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BewertungPayload>[]
          }
          create: {
            args: Prisma.BewertungCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BewertungPayload>
          }
          createMany: {
            args: Prisma.BewertungCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.BewertungDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BewertungPayload>
          }
          update: {
            args: Prisma.BewertungUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BewertungPayload>
          }
          deleteMany: {
            args: Prisma.BewertungDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BewertungUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BewertungUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BewertungPayload>
          }
          aggregate: {
            args: Prisma.BewertungAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBewertung>
          }
          groupBy: {
            args: Prisma.BewertungGroupByArgs<ExtArgs>
            result: $Utils.Optional<BewertungGroupByOutputType>[]
          }
          count: {
            args: Prisma.BewertungCountArgs<ExtArgs>
            result: $Utils.Optional<BewertungCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    session?: SessionOmit
    restaurant?: RestaurantOmit
    location?: LocationOmit
    reservierung?: ReservierungOmit
    menu?: MenuOmit
    kategorie?: KategorieOmit
    gericht?: GerichtOmit
    zutat?: ZutatOmit
    bewertung?: BewertungOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type SessionCountOutputType
   */

  export type SessionCountOutputType = {
    users: number
  }

  export type SessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | SessionCountOutputTypeCountUsersArgs
  }

  // Custom InputTypes
  /**
   * SessionCountOutputType without action
   */
  export type SessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SessionCountOutputType
     */
    select?: SessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SessionCountOutputType without action
   */
  export type SessionCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Count Type RestaurantCountOutputType
   */

  export type RestaurantCountOutputType = {
    location: number
    reservierung: number
  }

  export type RestaurantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    location?: boolean | RestaurantCountOutputTypeCountLocationArgs
    reservierung?: boolean | RestaurantCountOutputTypeCountReservierungArgs
  }

  // Custom InputTypes
  /**
   * RestaurantCountOutputType without action
   */
  export type RestaurantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RestaurantCountOutputType
     */
    select?: RestaurantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RestaurantCountOutputType without action
   */
  export type RestaurantCountOutputTypeCountLocationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationWhereInput
  }

  /**
   * RestaurantCountOutputType without action
   */
  export type RestaurantCountOutputTypeCountReservierungArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservierungWhereInput
  }


  /**
   * Count Type MenuCountOutputType
   */

  export type MenuCountOutputType = {
    kategorien: number
  }

  export type MenuCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kategorien?: boolean | MenuCountOutputTypeCountKategorienArgs
  }

  // Custom InputTypes
  /**
   * MenuCountOutputType without action
   */
  export type MenuCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MenuCountOutputType
     */
    select?: MenuCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MenuCountOutputType without action
   */
  export type MenuCountOutputTypeCountKategorienArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KategorieWhereInput
  }


  /**
   * Count Type KategorieCountOutputType
   */

  export type KategorieCountOutputType = {
    gerichte: number
  }

  export type KategorieCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gerichte?: boolean | KategorieCountOutputTypeCountGerichteArgs
  }

  // Custom InputTypes
  /**
   * KategorieCountOutputType without action
   */
  export type KategorieCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KategorieCountOutputType
     */
    select?: KategorieCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * KategorieCountOutputType without action
   */
  export type KategorieCountOutputTypeCountGerichteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GerichtWhereInput
  }


  /**
   * Count Type GerichtCountOutputType
   */

  export type GerichtCountOutputType = {
    zutaten: number
    Bewertung: number
  }

  export type GerichtCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    zutaten?: boolean | GerichtCountOutputTypeCountZutatenArgs
    Bewertung?: boolean | GerichtCountOutputTypeCountBewertungArgs
  }

  // Custom InputTypes
  /**
   * GerichtCountOutputType without action
   */
  export type GerichtCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GerichtCountOutputType
     */
    select?: GerichtCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GerichtCountOutputType without action
   */
  export type GerichtCountOutputTypeCountZutatenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ZutatWhereInput
  }

  /**
   * GerichtCountOutputType without action
   */
  export type GerichtCountOutputTypeCountBewertungArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BewertungWhereInput
  }


  /**
   * Count Type ZutatCountOutputType
   */

  export type ZutatCountOutputType = {
    gerichte: number
  }

  export type ZutatCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gerichte?: boolean | ZutatCountOutputTypeCountGerichteArgs
  }

  // Custom InputTypes
  /**
   * ZutatCountOutputType without action
   */
  export type ZutatCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ZutatCountOutputType
     */
    select?: ZutatCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ZutatCountOutputType without action
   */
  export type ZutatCountOutputTypeCountGerichteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GerichtWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    sessionID: string | null
    role: $Enums.Role | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    sessionID: string | null
    role: $Enums.Role | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    passwordHash: number
    sessionID: number
    role: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    sessionID?: true
    role?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    sessionID?: true
    role?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    sessionID?: true
    role?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    passwordHash: string
    sessionID: string
    role: $Enums.Role
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    sessionID?: boolean
    role?: boolean
    createdAt?: boolean
    session?: boolean | SessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>



  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    sessionID?: boolean
    role?: boolean
    createdAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "passwordHash" | "sessionID" | "role" | "createdAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | SessionDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      session: Prisma.$SessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      passwordHash: string
      sessionID: string
      role: $Enums.Role
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends SessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SessionDefaultArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly sessionID: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    timeIn: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    timeIn: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    timeIn: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    timeIn?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    timeIn?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    timeIn?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    timeIn: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timeIn?: boolean
    users?: boolean | Session$usersArgs<ExtArgs>
    _count?: boolean | SessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>



  export type SessionSelectScalar = {
    id?: boolean
    timeIn?: boolean
  }

  export type SessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "timeIn", ExtArgs["result"]["session"]>
  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Session$usersArgs<ExtArgs>
    _count?: boolean | SessionCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      timeIn: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Session$usersArgs<ExtArgs> = {}>(args?: Subset<T, Session$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly timeIn: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to update.
     */
    limit?: number
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
    /**
     * Limit how many Sessions to delete.
     */
    limit?: number
  }

  /**
   * Session.users
   */
  export type Session$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Session
     */
    omit?: SessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model Restaurant
   */

  export type AggregateRestaurant = {
    _count: RestaurantCountAggregateOutputType | null
    _min: RestaurantMinAggregateOutputType | null
    _max: RestaurantMaxAggregateOutputType | null
  }

  export type RestaurantMinAggregateOutputType = {
    id: string | null
    name: string | null
    parrentCompName: string | null
    parrentCompID: string | null
    menuId: string | null
    memberSince: Date | null
    locationID: string | null
  }

  export type RestaurantMaxAggregateOutputType = {
    id: string | null
    name: string | null
    parrentCompName: string | null
    parrentCompID: string | null
    menuId: string | null
    memberSince: Date | null
    locationID: string | null
  }

  export type RestaurantCountAggregateOutputType = {
    id: number
    name: number
    parrentCompName: number
    parrentCompID: number
    menuId: number
    memberSince: number
    locationID: number
    _all: number
  }


  export type RestaurantMinAggregateInputType = {
    id?: true
    name?: true
    parrentCompName?: true
    parrentCompID?: true
    menuId?: true
    memberSince?: true
    locationID?: true
  }

  export type RestaurantMaxAggregateInputType = {
    id?: true
    name?: true
    parrentCompName?: true
    parrentCompID?: true
    menuId?: true
    memberSince?: true
    locationID?: true
  }

  export type RestaurantCountAggregateInputType = {
    id?: true
    name?: true
    parrentCompName?: true
    parrentCompID?: true
    menuId?: true
    memberSince?: true
    locationID?: true
    _all?: true
  }

  export type RestaurantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Restaurant to aggregate.
     */
    where?: RestaurantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Restaurants to fetch.
     */
    orderBy?: RestaurantOrderByWithRelationInput | RestaurantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RestaurantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Restaurants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Restaurants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Restaurants
    **/
    _count?: true | RestaurantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RestaurantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RestaurantMaxAggregateInputType
  }

  export type GetRestaurantAggregateType<T extends RestaurantAggregateArgs> = {
        [P in keyof T & keyof AggregateRestaurant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRestaurant[P]>
      : GetScalarType<T[P], AggregateRestaurant[P]>
  }




  export type RestaurantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RestaurantWhereInput
    orderBy?: RestaurantOrderByWithAggregationInput | RestaurantOrderByWithAggregationInput[]
    by: RestaurantScalarFieldEnum[] | RestaurantScalarFieldEnum
    having?: RestaurantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RestaurantCountAggregateInputType | true
    _min?: RestaurantMinAggregateInputType
    _max?: RestaurantMaxAggregateInputType
  }

  export type RestaurantGroupByOutputType = {
    id: string
    name: string
    parrentCompName: string
    parrentCompID: string
    menuId: string
    memberSince: Date
    locationID: string
    _count: RestaurantCountAggregateOutputType | null
    _min: RestaurantMinAggregateOutputType | null
    _max: RestaurantMaxAggregateOutputType | null
  }

  type GetRestaurantGroupByPayload<T extends RestaurantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RestaurantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RestaurantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RestaurantGroupByOutputType[P]>
            : GetScalarType<T[P], RestaurantGroupByOutputType[P]>
        }
      >
    >


  export type RestaurantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    parrentCompName?: boolean
    parrentCompID?: boolean
    menuId?: boolean
    memberSince?: boolean
    locationID?: boolean
    menu?: boolean | Restaurant$menuArgs<ExtArgs>
    location?: boolean | Restaurant$locationArgs<ExtArgs>
    reservierung?: boolean | Restaurant$reservierungArgs<ExtArgs>
    _count?: boolean | RestaurantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["restaurant"]>



  export type RestaurantSelectScalar = {
    id?: boolean
    name?: boolean
    parrentCompName?: boolean
    parrentCompID?: boolean
    menuId?: boolean
    memberSince?: boolean
    locationID?: boolean
  }

  export type RestaurantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "parrentCompName" | "parrentCompID" | "menuId" | "memberSince" | "locationID", ExtArgs["result"]["restaurant"]>
  export type RestaurantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    menu?: boolean | Restaurant$menuArgs<ExtArgs>
    location?: boolean | Restaurant$locationArgs<ExtArgs>
    reservierung?: boolean | Restaurant$reservierungArgs<ExtArgs>
    _count?: boolean | RestaurantCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $RestaurantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Restaurant"
    objects: {
      menu: Prisma.$MenuPayload<ExtArgs> | null
      location: Prisma.$LocationPayload<ExtArgs>[]
      reservierung: Prisma.$ReservierungPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      parrentCompName: string
      parrentCompID: string
      menuId: string
      memberSince: Date
      locationID: string
    }, ExtArgs["result"]["restaurant"]>
    composites: {}
  }

  type RestaurantGetPayload<S extends boolean | null | undefined | RestaurantDefaultArgs> = $Result.GetResult<Prisma.$RestaurantPayload, S>

  type RestaurantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RestaurantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RestaurantCountAggregateInputType | true
    }

  export interface RestaurantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Restaurant'], meta: { name: 'Restaurant' } }
    /**
     * Find zero or one Restaurant that matches the filter.
     * @param {RestaurantFindUniqueArgs} args - Arguments to find a Restaurant
     * @example
     * // Get one Restaurant
     * const restaurant = await prisma.restaurant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RestaurantFindUniqueArgs>(args: SelectSubset<T, RestaurantFindUniqueArgs<ExtArgs>>): Prisma__RestaurantClient<$Result.GetResult<Prisma.$RestaurantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Restaurant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RestaurantFindUniqueOrThrowArgs} args - Arguments to find a Restaurant
     * @example
     * // Get one Restaurant
     * const restaurant = await prisma.restaurant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RestaurantFindUniqueOrThrowArgs>(args: SelectSubset<T, RestaurantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RestaurantClient<$Result.GetResult<Prisma.$RestaurantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Restaurant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestaurantFindFirstArgs} args - Arguments to find a Restaurant
     * @example
     * // Get one Restaurant
     * const restaurant = await prisma.restaurant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RestaurantFindFirstArgs>(args?: SelectSubset<T, RestaurantFindFirstArgs<ExtArgs>>): Prisma__RestaurantClient<$Result.GetResult<Prisma.$RestaurantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Restaurant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestaurantFindFirstOrThrowArgs} args - Arguments to find a Restaurant
     * @example
     * // Get one Restaurant
     * const restaurant = await prisma.restaurant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RestaurantFindFirstOrThrowArgs>(args?: SelectSubset<T, RestaurantFindFirstOrThrowArgs<ExtArgs>>): Prisma__RestaurantClient<$Result.GetResult<Prisma.$RestaurantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Restaurants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestaurantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Restaurants
     * const restaurants = await prisma.restaurant.findMany()
     * 
     * // Get first 10 Restaurants
     * const restaurants = await prisma.restaurant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const restaurantWithIdOnly = await prisma.restaurant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RestaurantFindManyArgs>(args?: SelectSubset<T, RestaurantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RestaurantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Restaurant.
     * @param {RestaurantCreateArgs} args - Arguments to create a Restaurant.
     * @example
     * // Create one Restaurant
     * const Restaurant = await prisma.restaurant.create({
     *   data: {
     *     // ... data to create a Restaurant
     *   }
     * })
     * 
     */
    create<T extends RestaurantCreateArgs>(args: SelectSubset<T, RestaurantCreateArgs<ExtArgs>>): Prisma__RestaurantClient<$Result.GetResult<Prisma.$RestaurantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Restaurants.
     * @param {RestaurantCreateManyArgs} args - Arguments to create many Restaurants.
     * @example
     * // Create many Restaurants
     * const restaurant = await prisma.restaurant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RestaurantCreateManyArgs>(args?: SelectSubset<T, RestaurantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Restaurant.
     * @param {RestaurantDeleteArgs} args - Arguments to delete one Restaurant.
     * @example
     * // Delete one Restaurant
     * const Restaurant = await prisma.restaurant.delete({
     *   where: {
     *     // ... filter to delete one Restaurant
     *   }
     * })
     * 
     */
    delete<T extends RestaurantDeleteArgs>(args: SelectSubset<T, RestaurantDeleteArgs<ExtArgs>>): Prisma__RestaurantClient<$Result.GetResult<Prisma.$RestaurantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Restaurant.
     * @param {RestaurantUpdateArgs} args - Arguments to update one Restaurant.
     * @example
     * // Update one Restaurant
     * const restaurant = await prisma.restaurant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RestaurantUpdateArgs>(args: SelectSubset<T, RestaurantUpdateArgs<ExtArgs>>): Prisma__RestaurantClient<$Result.GetResult<Prisma.$RestaurantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Restaurants.
     * @param {RestaurantDeleteManyArgs} args - Arguments to filter Restaurants to delete.
     * @example
     * // Delete a few Restaurants
     * const { count } = await prisma.restaurant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RestaurantDeleteManyArgs>(args?: SelectSubset<T, RestaurantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Restaurants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestaurantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Restaurants
     * const restaurant = await prisma.restaurant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RestaurantUpdateManyArgs>(args: SelectSubset<T, RestaurantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Restaurant.
     * @param {RestaurantUpsertArgs} args - Arguments to update or create a Restaurant.
     * @example
     * // Update or create a Restaurant
     * const restaurant = await prisma.restaurant.upsert({
     *   create: {
     *     // ... data to create a Restaurant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Restaurant we want to update
     *   }
     * })
     */
    upsert<T extends RestaurantUpsertArgs>(args: SelectSubset<T, RestaurantUpsertArgs<ExtArgs>>): Prisma__RestaurantClient<$Result.GetResult<Prisma.$RestaurantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Restaurants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestaurantCountArgs} args - Arguments to filter Restaurants to count.
     * @example
     * // Count the number of Restaurants
     * const count = await prisma.restaurant.count({
     *   where: {
     *     // ... the filter for the Restaurants we want to count
     *   }
     * })
    **/
    count<T extends RestaurantCountArgs>(
      args?: Subset<T, RestaurantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RestaurantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Restaurant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestaurantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RestaurantAggregateArgs>(args: Subset<T, RestaurantAggregateArgs>): Prisma.PrismaPromise<GetRestaurantAggregateType<T>>

    /**
     * Group by Restaurant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RestaurantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RestaurantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RestaurantGroupByArgs['orderBy'] }
        : { orderBy?: RestaurantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RestaurantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRestaurantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Restaurant model
   */
  readonly fields: RestaurantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Restaurant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RestaurantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    menu<T extends Restaurant$menuArgs<ExtArgs> = {}>(args?: Subset<T, Restaurant$menuArgs<ExtArgs>>): Prisma__MenuClient<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    location<T extends Restaurant$locationArgs<ExtArgs> = {}>(args?: Subset<T, Restaurant$locationArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reservierung<T extends Restaurant$reservierungArgs<ExtArgs> = {}>(args?: Subset<T, Restaurant$reservierungArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservierungPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Restaurant model
   */
  interface RestaurantFieldRefs {
    readonly id: FieldRef<"Restaurant", 'String'>
    readonly name: FieldRef<"Restaurant", 'String'>
    readonly parrentCompName: FieldRef<"Restaurant", 'String'>
    readonly parrentCompID: FieldRef<"Restaurant", 'String'>
    readonly menuId: FieldRef<"Restaurant", 'String'>
    readonly memberSince: FieldRef<"Restaurant", 'DateTime'>
    readonly locationID: FieldRef<"Restaurant", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Restaurant findUnique
   */
  export type RestaurantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Restaurant
     */
    select?: RestaurantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Restaurant
     */
    omit?: RestaurantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RestaurantInclude<ExtArgs> | null
    /**
     * Filter, which Restaurant to fetch.
     */
    where: RestaurantWhereUniqueInput
  }

  /**
   * Restaurant findUniqueOrThrow
   */
  export type RestaurantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Restaurant
     */
    select?: RestaurantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Restaurant
     */
    omit?: RestaurantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RestaurantInclude<ExtArgs> | null
    /**
     * Filter, which Restaurant to fetch.
     */
    where: RestaurantWhereUniqueInput
  }

  /**
   * Restaurant findFirst
   */
  export type RestaurantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Restaurant
     */
    select?: RestaurantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Restaurant
     */
    omit?: RestaurantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RestaurantInclude<ExtArgs> | null
    /**
     * Filter, which Restaurant to fetch.
     */
    where?: RestaurantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Restaurants to fetch.
     */
    orderBy?: RestaurantOrderByWithRelationInput | RestaurantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Restaurants.
     */
    cursor?: RestaurantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Restaurants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Restaurants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Restaurants.
     */
    distinct?: RestaurantScalarFieldEnum | RestaurantScalarFieldEnum[]
  }

  /**
   * Restaurant findFirstOrThrow
   */
  export type RestaurantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Restaurant
     */
    select?: RestaurantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Restaurant
     */
    omit?: RestaurantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RestaurantInclude<ExtArgs> | null
    /**
     * Filter, which Restaurant to fetch.
     */
    where?: RestaurantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Restaurants to fetch.
     */
    orderBy?: RestaurantOrderByWithRelationInput | RestaurantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Restaurants.
     */
    cursor?: RestaurantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Restaurants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Restaurants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Restaurants.
     */
    distinct?: RestaurantScalarFieldEnum | RestaurantScalarFieldEnum[]
  }

  /**
   * Restaurant findMany
   */
  export type RestaurantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Restaurant
     */
    select?: RestaurantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Restaurant
     */
    omit?: RestaurantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RestaurantInclude<ExtArgs> | null
    /**
     * Filter, which Restaurants to fetch.
     */
    where?: RestaurantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Restaurants to fetch.
     */
    orderBy?: RestaurantOrderByWithRelationInput | RestaurantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Restaurants.
     */
    cursor?: RestaurantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Restaurants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Restaurants.
     */
    skip?: number
    distinct?: RestaurantScalarFieldEnum | RestaurantScalarFieldEnum[]
  }

  /**
   * Restaurant create
   */
  export type RestaurantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Restaurant
     */
    select?: RestaurantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Restaurant
     */
    omit?: RestaurantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RestaurantInclude<ExtArgs> | null
    /**
     * The data needed to create a Restaurant.
     */
    data: XOR<RestaurantCreateInput, RestaurantUncheckedCreateInput>
  }

  /**
   * Restaurant createMany
   */
  export type RestaurantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Restaurants.
     */
    data: RestaurantCreateManyInput | RestaurantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Restaurant update
   */
  export type RestaurantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Restaurant
     */
    select?: RestaurantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Restaurant
     */
    omit?: RestaurantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RestaurantInclude<ExtArgs> | null
    /**
     * The data needed to update a Restaurant.
     */
    data: XOR<RestaurantUpdateInput, RestaurantUncheckedUpdateInput>
    /**
     * Choose, which Restaurant to update.
     */
    where: RestaurantWhereUniqueInput
  }

  /**
   * Restaurant updateMany
   */
  export type RestaurantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Restaurants.
     */
    data: XOR<RestaurantUpdateManyMutationInput, RestaurantUncheckedUpdateManyInput>
    /**
     * Filter which Restaurants to update
     */
    where?: RestaurantWhereInput
    /**
     * Limit how many Restaurants to update.
     */
    limit?: number
  }

  /**
   * Restaurant upsert
   */
  export type RestaurantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Restaurant
     */
    select?: RestaurantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Restaurant
     */
    omit?: RestaurantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RestaurantInclude<ExtArgs> | null
    /**
     * The filter to search for the Restaurant to update in case it exists.
     */
    where: RestaurantWhereUniqueInput
    /**
     * In case the Restaurant found by the `where` argument doesn't exist, create a new Restaurant with this data.
     */
    create: XOR<RestaurantCreateInput, RestaurantUncheckedCreateInput>
    /**
     * In case the Restaurant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RestaurantUpdateInput, RestaurantUncheckedUpdateInput>
  }

  /**
   * Restaurant delete
   */
  export type RestaurantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Restaurant
     */
    select?: RestaurantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Restaurant
     */
    omit?: RestaurantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RestaurantInclude<ExtArgs> | null
    /**
     * Filter which Restaurant to delete.
     */
    where: RestaurantWhereUniqueInput
  }

  /**
   * Restaurant deleteMany
   */
  export type RestaurantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Restaurants to delete
     */
    where?: RestaurantWhereInput
    /**
     * Limit how many Restaurants to delete.
     */
    limit?: number
  }

  /**
   * Restaurant.menu
   */
  export type Restaurant$menuArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
    where?: MenuWhereInput
  }

  /**
   * Restaurant.location
   */
  export type Restaurant$locationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    where?: LocationWhereInput
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    cursor?: LocationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Restaurant.reservierung
   */
  export type Restaurant$reservierungArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservierung
     */
    select?: ReservierungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservierung
     */
    omit?: ReservierungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservierungInclude<ExtArgs> | null
    where?: ReservierungWhereInput
    orderBy?: ReservierungOrderByWithRelationInput | ReservierungOrderByWithRelationInput[]
    cursor?: ReservierungWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReservierungScalarFieldEnum | ReservierungScalarFieldEnum[]
  }

  /**
   * Restaurant without action
   */
  export type RestaurantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Restaurant
     */
    select?: RestaurantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Restaurant
     */
    omit?: RestaurantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RestaurantInclude<ExtArgs> | null
  }


  /**
   * Model Location
   */

  export type AggregateLocation = {
    _count: LocationCountAggregateOutputType | null
    _min: LocationMinAggregateOutputType | null
    _max: LocationMaxAggregateOutputType | null
  }

  export type LocationMinAggregateOutputType = {
    id: string | null
    street: string | null
    Hausnummer: string | null
    town: string | null
    postcode: string | null
    country: string | null
    restaurantID: string | null
  }

  export type LocationMaxAggregateOutputType = {
    id: string | null
    street: string | null
    Hausnummer: string | null
    town: string | null
    postcode: string | null
    country: string | null
    restaurantID: string | null
  }

  export type LocationCountAggregateOutputType = {
    id: number
    street: number
    Hausnummer: number
    town: number
    postcode: number
    country: number
    restaurantID: number
    _all: number
  }


  export type LocationMinAggregateInputType = {
    id?: true
    street?: true
    Hausnummer?: true
    town?: true
    postcode?: true
    country?: true
    restaurantID?: true
  }

  export type LocationMaxAggregateInputType = {
    id?: true
    street?: true
    Hausnummer?: true
    town?: true
    postcode?: true
    country?: true
    restaurantID?: true
  }

  export type LocationCountAggregateInputType = {
    id?: true
    street?: true
    Hausnummer?: true
    town?: true
    postcode?: true
    country?: true
    restaurantID?: true
    _all?: true
  }

  export type LocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Location to aggregate.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Locations
    **/
    _count?: true | LocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocationMaxAggregateInputType
  }

  export type GetLocationAggregateType<T extends LocationAggregateArgs> = {
        [P in keyof T & keyof AggregateLocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocation[P]>
      : GetScalarType<T[P], AggregateLocation[P]>
  }




  export type LocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationWhereInput
    orderBy?: LocationOrderByWithAggregationInput | LocationOrderByWithAggregationInput[]
    by: LocationScalarFieldEnum[] | LocationScalarFieldEnum
    having?: LocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocationCountAggregateInputType | true
    _min?: LocationMinAggregateInputType
    _max?: LocationMaxAggregateInputType
  }

  export type LocationGroupByOutputType = {
    id: string
    street: string
    Hausnummer: string
    town: string
    postcode: string
    country: string
    restaurantID: string
    _count: LocationCountAggregateOutputType | null
    _min: LocationMinAggregateOutputType | null
    _max: LocationMaxAggregateOutputType | null
  }

  type GetLocationGroupByPayload<T extends LocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocationGroupByOutputType[P]>
            : GetScalarType<T[P], LocationGroupByOutputType[P]>
        }
      >
    >


  export type LocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    street?: boolean
    Hausnummer?: boolean
    town?: boolean
    postcode?: boolean
    country?: boolean
    restaurantID?: boolean
    restaurant?: boolean | RestaurantDefaultArgs<ExtArgs>
    reservierung?: boolean | Location$reservierungArgs<ExtArgs>
  }, ExtArgs["result"]["location"]>



  export type LocationSelectScalar = {
    id?: boolean
    street?: boolean
    Hausnummer?: boolean
    town?: boolean
    postcode?: boolean
    country?: boolean
    restaurantID?: boolean
  }

  export type LocationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "street" | "Hausnummer" | "town" | "postcode" | "country" | "restaurantID", ExtArgs["result"]["location"]>
  export type LocationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    restaurant?: boolean | RestaurantDefaultArgs<ExtArgs>
    reservierung?: boolean | Location$reservierungArgs<ExtArgs>
  }

  export type $LocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Location"
    objects: {
      restaurant: Prisma.$RestaurantPayload<ExtArgs>
      reservierung: Prisma.$ReservierungPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      street: string
      Hausnummer: string
      town: string
      postcode: string
      country: string
      restaurantID: string
    }, ExtArgs["result"]["location"]>
    composites: {}
  }

  type LocationGetPayload<S extends boolean | null | undefined | LocationDefaultArgs> = $Result.GetResult<Prisma.$LocationPayload, S>

  type LocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocationCountAggregateInputType | true
    }

  export interface LocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Location'], meta: { name: 'Location' } }
    /**
     * Find zero or one Location that matches the filter.
     * @param {LocationFindUniqueArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocationFindUniqueArgs>(args: SelectSubset<T, LocationFindUniqueArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Location that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocationFindUniqueOrThrowArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocationFindUniqueOrThrowArgs>(args: SelectSubset<T, LocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Location that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindFirstArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocationFindFirstArgs>(args?: SelectSubset<T, LocationFindFirstArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Location that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindFirstOrThrowArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocationFindFirstOrThrowArgs>(args?: SelectSubset<T, LocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Locations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Locations
     * const locations = await prisma.location.findMany()
     * 
     * // Get first 10 Locations
     * const locations = await prisma.location.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const locationWithIdOnly = await prisma.location.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocationFindManyArgs>(args?: SelectSubset<T, LocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Location.
     * @param {LocationCreateArgs} args - Arguments to create a Location.
     * @example
     * // Create one Location
     * const Location = await prisma.location.create({
     *   data: {
     *     // ... data to create a Location
     *   }
     * })
     * 
     */
    create<T extends LocationCreateArgs>(args: SelectSubset<T, LocationCreateArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Locations.
     * @param {LocationCreateManyArgs} args - Arguments to create many Locations.
     * @example
     * // Create many Locations
     * const location = await prisma.location.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocationCreateManyArgs>(args?: SelectSubset<T, LocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Location.
     * @param {LocationDeleteArgs} args - Arguments to delete one Location.
     * @example
     * // Delete one Location
     * const Location = await prisma.location.delete({
     *   where: {
     *     // ... filter to delete one Location
     *   }
     * })
     * 
     */
    delete<T extends LocationDeleteArgs>(args: SelectSubset<T, LocationDeleteArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Location.
     * @param {LocationUpdateArgs} args - Arguments to update one Location.
     * @example
     * // Update one Location
     * const location = await prisma.location.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocationUpdateArgs>(args: SelectSubset<T, LocationUpdateArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Locations.
     * @param {LocationDeleteManyArgs} args - Arguments to filter Locations to delete.
     * @example
     * // Delete a few Locations
     * const { count } = await prisma.location.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocationDeleteManyArgs>(args?: SelectSubset<T, LocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Locations
     * const location = await prisma.location.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocationUpdateManyArgs>(args: SelectSubset<T, LocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Location.
     * @param {LocationUpsertArgs} args - Arguments to update or create a Location.
     * @example
     * // Update or create a Location
     * const location = await prisma.location.upsert({
     *   create: {
     *     // ... data to create a Location
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Location we want to update
     *   }
     * })
     */
    upsert<T extends LocationUpsertArgs>(args: SelectSubset<T, LocationUpsertArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationCountArgs} args - Arguments to filter Locations to count.
     * @example
     * // Count the number of Locations
     * const count = await prisma.location.count({
     *   where: {
     *     // ... the filter for the Locations we want to count
     *   }
     * })
    **/
    count<T extends LocationCountArgs>(
      args?: Subset<T, LocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Location.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocationAggregateArgs>(args: Subset<T, LocationAggregateArgs>): Prisma.PrismaPromise<GetLocationAggregateType<T>>

    /**
     * Group by Location.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocationGroupByArgs['orderBy'] }
        : { orderBy?: LocationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Location model
   */
  readonly fields: LocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Location.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    restaurant<T extends RestaurantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RestaurantDefaultArgs<ExtArgs>>): Prisma__RestaurantClient<$Result.GetResult<Prisma.$RestaurantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    reservierung<T extends Location$reservierungArgs<ExtArgs> = {}>(args?: Subset<T, Location$reservierungArgs<ExtArgs>>): Prisma__ReservierungClient<$Result.GetResult<Prisma.$ReservierungPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Location model
   */
  interface LocationFieldRefs {
    readonly id: FieldRef<"Location", 'String'>
    readonly street: FieldRef<"Location", 'String'>
    readonly Hausnummer: FieldRef<"Location", 'String'>
    readonly town: FieldRef<"Location", 'String'>
    readonly postcode: FieldRef<"Location", 'String'>
    readonly country: FieldRef<"Location", 'String'>
    readonly restaurantID: FieldRef<"Location", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Location findUnique
   */
  export type LocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location findUniqueOrThrow
   */
  export type LocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location findFirst
   */
  export type LocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Locations.
     */
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location findFirstOrThrow
   */
  export type LocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Locations.
     */
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location findMany
   */
  export type LocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Locations to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location create
   */
  export type LocationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The data needed to create a Location.
     */
    data: XOR<LocationCreateInput, LocationUncheckedCreateInput>
  }

  /**
   * Location createMany
   */
  export type LocationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Locations.
     */
    data: LocationCreateManyInput | LocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Location update
   */
  export type LocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The data needed to update a Location.
     */
    data: XOR<LocationUpdateInput, LocationUncheckedUpdateInput>
    /**
     * Choose, which Location to update.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location updateMany
   */
  export type LocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Locations.
     */
    data: XOR<LocationUpdateManyMutationInput, LocationUncheckedUpdateManyInput>
    /**
     * Filter which Locations to update
     */
    where?: LocationWhereInput
    /**
     * Limit how many Locations to update.
     */
    limit?: number
  }

  /**
   * Location upsert
   */
  export type LocationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The filter to search for the Location to update in case it exists.
     */
    where: LocationWhereUniqueInput
    /**
     * In case the Location found by the `where` argument doesn't exist, create a new Location with this data.
     */
    create: XOR<LocationCreateInput, LocationUncheckedCreateInput>
    /**
     * In case the Location was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocationUpdateInput, LocationUncheckedUpdateInput>
  }

  /**
   * Location delete
   */
  export type LocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter which Location to delete.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location deleteMany
   */
  export type LocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Locations to delete
     */
    where?: LocationWhereInput
    /**
     * Limit how many Locations to delete.
     */
    limit?: number
  }

  /**
   * Location.reservierung
   */
  export type Location$reservierungArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservierung
     */
    select?: ReservierungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservierung
     */
    omit?: ReservierungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservierungInclude<ExtArgs> | null
    where?: ReservierungWhereInput
  }

  /**
   * Location without action
   */
  export type LocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
  }


  /**
   * Model Reservierung
   */

  export type AggregateReservierung = {
    _count: ReservierungCountAggregateOutputType | null
    _min: ReservierungMinAggregateOutputType | null
    _max: ReservierungMaxAggregateOutputType | null
  }

  export type ReservierungMinAggregateOutputType = {
    id: string | null
    locationID: string | null
    restaurantID: string | null
    phoneNum: string | null
  }

  export type ReservierungMaxAggregateOutputType = {
    id: string | null
    locationID: string | null
    restaurantID: string | null
    phoneNum: string | null
  }

  export type ReservierungCountAggregateOutputType = {
    id: number
    locationID: number
    restaurantID: number
    phoneNum: number
    _all: number
  }


  export type ReservierungMinAggregateInputType = {
    id?: true
    locationID?: true
    restaurantID?: true
    phoneNum?: true
  }

  export type ReservierungMaxAggregateInputType = {
    id?: true
    locationID?: true
    restaurantID?: true
    phoneNum?: true
  }

  export type ReservierungCountAggregateInputType = {
    id?: true
    locationID?: true
    restaurantID?: true
    phoneNum?: true
    _all?: true
  }

  export type ReservierungAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reservierung to aggregate.
     */
    where?: ReservierungWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservierungs to fetch.
     */
    orderBy?: ReservierungOrderByWithRelationInput | ReservierungOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReservierungWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservierungs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservierungs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reservierungs
    **/
    _count?: true | ReservierungCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReservierungMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReservierungMaxAggregateInputType
  }

  export type GetReservierungAggregateType<T extends ReservierungAggregateArgs> = {
        [P in keyof T & keyof AggregateReservierung]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReservierung[P]>
      : GetScalarType<T[P], AggregateReservierung[P]>
  }




  export type ReservierungGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReservierungWhereInput
    orderBy?: ReservierungOrderByWithAggregationInput | ReservierungOrderByWithAggregationInput[]
    by: ReservierungScalarFieldEnum[] | ReservierungScalarFieldEnum
    having?: ReservierungScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReservierungCountAggregateInputType | true
    _min?: ReservierungMinAggregateInputType
    _max?: ReservierungMaxAggregateInputType
  }

  export type ReservierungGroupByOutputType = {
    id: string
    locationID: string
    restaurantID: string
    phoneNum: string
    _count: ReservierungCountAggregateOutputType | null
    _min: ReservierungMinAggregateOutputType | null
    _max: ReservierungMaxAggregateOutputType | null
  }

  type GetReservierungGroupByPayload<T extends ReservierungGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReservierungGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReservierungGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReservierungGroupByOutputType[P]>
            : GetScalarType<T[P], ReservierungGroupByOutputType[P]>
        }
      >
    >


  export type ReservierungSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    locationID?: boolean
    restaurantID?: boolean
    phoneNum?: boolean
    location?: boolean | LocationDefaultArgs<ExtArgs>
    restaurant?: boolean | RestaurantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["reservierung"]>



  export type ReservierungSelectScalar = {
    id?: boolean
    locationID?: boolean
    restaurantID?: boolean
    phoneNum?: boolean
  }

  export type ReservierungOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "locationID" | "restaurantID" | "phoneNum", ExtArgs["result"]["reservierung"]>
  export type ReservierungInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    location?: boolean | LocationDefaultArgs<ExtArgs>
    restaurant?: boolean | RestaurantDefaultArgs<ExtArgs>
  }

  export type $ReservierungPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Reservierung"
    objects: {
      location: Prisma.$LocationPayload<ExtArgs>
      restaurant: Prisma.$RestaurantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      locationID: string
      restaurantID: string
      phoneNum: string
    }, ExtArgs["result"]["reservierung"]>
    composites: {}
  }

  type ReservierungGetPayload<S extends boolean | null | undefined | ReservierungDefaultArgs> = $Result.GetResult<Prisma.$ReservierungPayload, S>

  type ReservierungCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReservierungFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReservierungCountAggregateInputType | true
    }

  export interface ReservierungDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Reservierung'], meta: { name: 'Reservierung' } }
    /**
     * Find zero or one Reservierung that matches the filter.
     * @param {ReservierungFindUniqueArgs} args - Arguments to find a Reservierung
     * @example
     * // Get one Reservierung
     * const reservierung = await prisma.reservierung.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReservierungFindUniqueArgs>(args: SelectSubset<T, ReservierungFindUniqueArgs<ExtArgs>>): Prisma__ReservierungClient<$Result.GetResult<Prisma.$ReservierungPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Reservierung that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReservierungFindUniqueOrThrowArgs} args - Arguments to find a Reservierung
     * @example
     * // Get one Reservierung
     * const reservierung = await prisma.reservierung.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReservierungFindUniqueOrThrowArgs>(args: SelectSubset<T, ReservierungFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReservierungClient<$Result.GetResult<Prisma.$ReservierungPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reservierung that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservierungFindFirstArgs} args - Arguments to find a Reservierung
     * @example
     * // Get one Reservierung
     * const reservierung = await prisma.reservierung.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReservierungFindFirstArgs>(args?: SelectSubset<T, ReservierungFindFirstArgs<ExtArgs>>): Prisma__ReservierungClient<$Result.GetResult<Prisma.$ReservierungPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Reservierung that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservierungFindFirstOrThrowArgs} args - Arguments to find a Reservierung
     * @example
     * // Get one Reservierung
     * const reservierung = await prisma.reservierung.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReservierungFindFirstOrThrowArgs>(args?: SelectSubset<T, ReservierungFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReservierungClient<$Result.GetResult<Prisma.$ReservierungPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Reservierungs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservierungFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reservierungs
     * const reservierungs = await prisma.reservierung.findMany()
     * 
     * // Get first 10 Reservierungs
     * const reservierungs = await prisma.reservierung.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reservierungWithIdOnly = await prisma.reservierung.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReservierungFindManyArgs>(args?: SelectSubset<T, ReservierungFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReservierungPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Reservierung.
     * @param {ReservierungCreateArgs} args - Arguments to create a Reservierung.
     * @example
     * // Create one Reservierung
     * const Reservierung = await prisma.reservierung.create({
     *   data: {
     *     // ... data to create a Reservierung
     *   }
     * })
     * 
     */
    create<T extends ReservierungCreateArgs>(args: SelectSubset<T, ReservierungCreateArgs<ExtArgs>>): Prisma__ReservierungClient<$Result.GetResult<Prisma.$ReservierungPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Reservierungs.
     * @param {ReservierungCreateManyArgs} args - Arguments to create many Reservierungs.
     * @example
     * // Create many Reservierungs
     * const reservierung = await prisma.reservierung.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReservierungCreateManyArgs>(args?: SelectSubset<T, ReservierungCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Reservierung.
     * @param {ReservierungDeleteArgs} args - Arguments to delete one Reservierung.
     * @example
     * // Delete one Reservierung
     * const Reservierung = await prisma.reservierung.delete({
     *   where: {
     *     // ... filter to delete one Reservierung
     *   }
     * })
     * 
     */
    delete<T extends ReservierungDeleteArgs>(args: SelectSubset<T, ReservierungDeleteArgs<ExtArgs>>): Prisma__ReservierungClient<$Result.GetResult<Prisma.$ReservierungPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Reservierung.
     * @param {ReservierungUpdateArgs} args - Arguments to update one Reservierung.
     * @example
     * // Update one Reservierung
     * const reservierung = await prisma.reservierung.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReservierungUpdateArgs>(args: SelectSubset<T, ReservierungUpdateArgs<ExtArgs>>): Prisma__ReservierungClient<$Result.GetResult<Prisma.$ReservierungPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Reservierungs.
     * @param {ReservierungDeleteManyArgs} args - Arguments to filter Reservierungs to delete.
     * @example
     * // Delete a few Reservierungs
     * const { count } = await prisma.reservierung.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReservierungDeleteManyArgs>(args?: SelectSubset<T, ReservierungDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reservierungs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservierungUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reservierungs
     * const reservierung = await prisma.reservierung.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReservierungUpdateManyArgs>(args: SelectSubset<T, ReservierungUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Reservierung.
     * @param {ReservierungUpsertArgs} args - Arguments to update or create a Reservierung.
     * @example
     * // Update or create a Reservierung
     * const reservierung = await prisma.reservierung.upsert({
     *   create: {
     *     // ... data to create a Reservierung
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Reservierung we want to update
     *   }
     * })
     */
    upsert<T extends ReservierungUpsertArgs>(args: SelectSubset<T, ReservierungUpsertArgs<ExtArgs>>): Prisma__ReservierungClient<$Result.GetResult<Prisma.$ReservierungPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Reservierungs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservierungCountArgs} args - Arguments to filter Reservierungs to count.
     * @example
     * // Count the number of Reservierungs
     * const count = await prisma.reservierung.count({
     *   where: {
     *     // ... the filter for the Reservierungs we want to count
     *   }
     * })
    **/
    count<T extends ReservierungCountArgs>(
      args?: Subset<T, ReservierungCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReservierungCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Reservierung.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservierungAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReservierungAggregateArgs>(args: Subset<T, ReservierungAggregateArgs>): Prisma.PrismaPromise<GetReservierungAggregateType<T>>

    /**
     * Group by Reservierung.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReservierungGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReservierungGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReservierungGroupByArgs['orderBy'] }
        : { orderBy?: ReservierungGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReservierungGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReservierungGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Reservierung model
   */
  readonly fields: ReservierungFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Reservierung.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReservierungClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    location<T extends LocationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LocationDefaultArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    restaurant<T extends RestaurantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RestaurantDefaultArgs<ExtArgs>>): Prisma__RestaurantClient<$Result.GetResult<Prisma.$RestaurantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Reservierung model
   */
  interface ReservierungFieldRefs {
    readonly id: FieldRef<"Reservierung", 'String'>
    readonly locationID: FieldRef<"Reservierung", 'String'>
    readonly restaurantID: FieldRef<"Reservierung", 'String'>
    readonly phoneNum: FieldRef<"Reservierung", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Reservierung findUnique
   */
  export type ReservierungFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservierung
     */
    select?: ReservierungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservierung
     */
    omit?: ReservierungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservierungInclude<ExtArgs> | null
    /**
     * Filter, which Reservierung to fetch.
     */
    where: ReservierungWhereUniqueInput
  }

  /**
   * Reservierung findUniqueOrThrow
   */
  export type ReservierungFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservierung
     */
    select?: ReservierungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservierung
     */
    omit?: ReservierungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservierungInclude<ExtArgs> | null
    /**
     * Filter, which Reservierung to fetch.
     */
    where: ReservierungWhereUniqueInput
  }

  /**
   * Reservierung findFirst
   */
  export type ReservierungFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservierung
     */
    select?: ReservierungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservierung
     */
    omit?: ReservierungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservierungInclude<ExtArgs> | null
    /**
     * Filter, which Reservierung to fetch.
     */
    where?: ReservierungWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservierungs to fetch.
     */
    orderBy?: ReservierungOrderByWithRelationInput | ReservierungOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reservierungs.
     */
    cursor?: ReservierungWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservierungs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservierungs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reservierungs.
     */
    distinct?: ReservierungScalarFieldEnum | ReservierungScalarFieldEnum[]
  }

  /**
   * Reservierung findFirstOrThrow
   */
  export type ReservierungFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservierung
     */
    select?: ReservierungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservierung
     */
    omit?: ReservierungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservierungInclude<ExtArgs> | null
    /**
     * Filter, which Reservierung to fetch.
     */
    where?: ReservierungWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservierungs to fetch.
     */
    orderBy?: ReservierungOrderByWithRelationInput | ReservierungOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reservierungs.
     */
    cursor?: ReservierungWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservierungs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservierungs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reservierungs.
     */
    distinct?: ReservierungScalarFieldEnum | ReservierungScalarFieldEnum[]
  }

  /**
   * Reservierung findMany
   */
  export type ReservierungFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservierung
     */
    select?: ReservierungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservierung
     */
    omit?: ReservierungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservierungInclude<ExtArgs> | null
    /**
     * Filter, which Reservierungs to fetch.
     */
    where?: ReservierungWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reservierungs to fetch.
     */
    orderBy?: ReservierungOrderByWithRelationInput | ReservierungOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reservierungs.
     */
    cursor?: ReservierungWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reservierungs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reservierungs.
     */
    skip?: number
    distinct?: ReservierungScalarFieldEnum | ReservierungScalarFieldEnum[]
  }

  /**
   * Reservierung create
   */
  export type ReservierungCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservierung
     */
    select?: ReservierungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservierung
     */
    omit?: ReservierungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservierungInclude<ExtArgs> | null
    /**
     * The data needed to create a Reservierung.
     */
    data: XOR<ReservierungCreateInput, ReservierungUncheckedCreateInput>
  }

  /**
   * Reservierung createMany
   */
  export type ReservierungCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reservierungs.
     */
    data: ReservierungCreateManyInput | ReservierungCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Reservierung update
   */
  export type ReservierungUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservierung
     */
    select?: ReservierungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservierung
     */
    omit?: ReservierungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservierungInclude<ExtArgs> | null
    /**
     * The data needed to update a Reservierung.
     */
    data: XOR<ReservierungUpdateInput, ReservierungUncheckedUpdateInput>
    /**
     * Choose, which Reservierung to update.
     */
    where: ReservierungWhereUniqueInput
  }

  /**
   * Reservierung updateMany
   */
  export type ReservierungUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reservierungs.
     */
    data: XOR<ReservierungUpdateManyMutationInput, ReservierungUncheckedUpdateManyInput>
    /**
     * Filter which Reservierungs to update
     */
    where?: ReservierungWhereInput
    /**
     * Limit how many Reservierungs to update.
     */
    limit?: number
  }

  /**
   * Reservierung upsert
   */
  export type ReservierungUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservierung
     */
    select?: ReservierungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservierung
     */
    omit?: ReservierungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservierungInclude<ExtArgs> | null
    /**
     * The filter to search for the Reservierung to update in case it exists.
     */
    where: ReservierungWhereUniqueInput
    /**
     * In case the Reservierung found by the `where` argument doesn't exist, create a new Reservierung with this data.
     */
    create: XOR<ReservierungCreateInput, ReservierungUncheckedCreateInput>
    /**
     * In case the Reservierung was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReservierungUpdateInput, ReservierungUncheckedUpdateInput>
  }

  /**
   * Reservierung delete
   */
  export type ReservierungDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservierung
     */
    select?: ReservierungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservierung
     */
    omit?: ReservierungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservierungInclude<ExtArgs> | null
    /**
     * Filter which Reservierung to delete.
     */
    where: ReservierungWhereUniqueInput
  }

  /**
   * Reservierung deleteMany
   */
  export type ReservierungDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reservierungs to delete
     */
    where?: ReservierungWhereInput
    /**
     * Limit how many Reservierungs to delete.
     */
    limit?: number
  }

  /**
   * Reservierung without action
   */
  export type ReservierungDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Reservierung
     */
    select?: ReservierungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Reservierung
     */
    omit?: ReservierungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReservierungInclude<ExtArgs> | null
  }


  /**
   * Model Menu
   */

  export type AggregateMenu = {
    _count: MenuCountAggregateOutputType | null
    _avg: MenuAvgAggregateOutputType | null
    _sum: MenuSumAggregateOutputType | null
    _min: MenuMinAggregateOutputType | null
    _max: MenuMaxAggregateOutputType | null
  }

  export type MenuAvgAggregateOutputType = {
    id: number | null
  }

  export type MenuSumAggregateOutputType = {
    id: number | null
  }

  export type MenuMinAggregateOutputType = {
    id: number | null
    name: string | null
    beschreibung: string | null
    erstelltAm: Date | null
    aktualisiertAm: Date | null
    restaurantID: string | null
  }

  export type MenuMaxAggregateOutputType = {
    id: number | null
    name: string | null
    beschreibung: string | null
    erstelltAm: Date | null
    aktualisiertAm: Date | null
    restaurantID: string | null
  }

  export type MenuCountAggregateOutputType = {
    id: number
    name: number
    beschreibung: number
    erstelltAm: number
    aktualisiertAm: number
    restaurantID: number
    _all: number
  }


  export type MenuAvgAggregateInputType = {
    id?: true
  }

  export type MenuSumAggregateInputType = {
    id?: true
  }

  export type MenuMinAggregateInputType = {
    id?: true
    name?: true
    beschreibung?: true
    erstelltAm?: true
    aktualisiertAm?: true
    restaurantID?: true
  }

  export type MenuMaxAggregateInputType = {
    id?: true
    name?: true
    beschreibung?: true
    erstelltAm?: true
    aktualisiertAm?: true
    restaurantID?: true
  }

  export type MenuCountAggregateInputType = {
    id?: true
    name?: true
    beschreibung?: true
    erstelltAm?: true
    aktualisiertAm?: true
    restaurantID?: true
    _all?: true
  }

  export type MenuAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Menu to aggregate.
     */
    where?: MenuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Menus to fetch.
     */
    orderBy?: MenuOrderByWithRelationInput | MenuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MenuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Menus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Menus.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Menus
    **/
    _count?: true | MenuCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MenuAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MenuSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MenuMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MenuMaxAggregateInputType
  }

  export type GetMenuAggregateType<T extends MenuAggregateArgs> = {
        [P in keyof T & keyof AggregateMenu]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMenu[P]>
      : GetScalarType<T[P], AggregateMenu[P]>
  }




  export type MenuGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MenuWhereInput
    orderBy?: MenuOrderByWithAggregationInput | MenuOrderByWithAggregationInput[]
    by: MenuScalarFieldEnum[] | MenuScalarFieldEnum
    having?: MenuScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MenuCountAggregateInputType | true
    _avg?: MenuAvgAggregateInputType
    _sum?: MenuSumAggregateInputType
    _min?: MenuMinAggregateInputType
    _max?: MenuMaxAggregateInputType
  }

  export type MenuGroupByOutputType = {
    id: number
    name: string
    beschreibung: string | null
    erstelltAm: Date
    aktualisiertAm: Date
    restaurantID: string
    _count: MenuCountAggregateOutputType | null
    _avg: MenuAvgAggregateOutputType | null
    _sum: MenuSumAggregateOutputType | null
    _min: MenuMinAggregateOutputType | null
    _max: MenuMaxAggregateOutputType | null
  }

  type GetMenuGroupByPayload<T extends MenuGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MenuGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MenuGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MenuGroupByOutputType[P]>
            : GetScalarType<T[P], MenuGroupByOutputType[P]>
        }
      >
    >


  export type MenuSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    beschreibung?: boolean
    erstelltAm?: boolean
    aktualisiertAm?: boolean
    restaurantID?: boolean
    kategorien?: boolean | Menu$kategorienArgs<ExtArgs>
    restaurant?: boolean | RestaurantDefaultArgs<ExtArgs>
    _count?: boolean | MenuCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["menu"]>



  export type MenuSelectScalar = {
    id?: boolean
    name?: boolean
    beschreibung?: boolean
    erstelltAm?: boolean
    aktualisiertAm?: boolean
    restaurantID?: boolean
  }

  export type MenuOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "beschreibung" | "erstelltAm" | "aktualisiertAm" | "restaurantID", ExtArgs["result"]["menu"]>
  export type MenuInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kategorien?: boolean | Menu$kategorienArgs<ExtArgs>
    restaurant?: boolean | RestaurantDefaultArgs<ExtArgs>
    _count?: boolean | MenuCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $MenuPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Menu"
    objects: {
      kategorien: Prisma.$KategoriePayload<ExtArgs>[]
      restaurant: Prisma.$RestaurantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      beschreibung: string | null
      erstelltAm: Date
      aktualisiertAm: Date
      restaurantID: string
    }, ExtArgs["result"]["menu"]>
    composites: {}
  }

  type MenuGetPayload<S extends boolean | null | undefined | MenuDefaultArgs> = $Result.GetResult<Prisma.$MenuPayload, S>

  type MenuCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MenuFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MenuCountAggregateInputType | true
    }

  export interface MenuDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Menu'], meta: { name: 'Menu' } }
    /**
     * Find zero or one Menu that matches the filter.
     * @param {MenuFindUniqueArgs} args - Arguments to find a Menu
     * @example
     * // Get one Menu
     * const menu = await prisma.menu.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MenuFindUniqueArgs>(args: SelectSubset<T, MenuFindUniqueArgs<ExtArgs>>): Prisma__MenuClient<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Menu that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MenuFindUniqueOrThrowArgs} args - Arguments to find a Menu
     * @example
     * // Get one Menu
     * const menu = await prisma.menu.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MenuFindUniqueOrThrowArgs>(args: SelectSubset<T, MenuFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MenuClient<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Menu that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuFindFirstArgs} args - Arguments to find a Menu
     * @example
     * // Get one Menu
     * const menu = await prisma.menu.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MenuFindFirstArgs>(args?: SelectSubset<T, MenuFindFirstArgs<ExtArgs>>): Prisma__MenuClient<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Menu that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuFindFirstOrThrowArgs} args - Arguments to find a Menu
     * @example
     * // Get one Menu
     * const menu = await prisma.menu.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MenuFindFirstOrThrowArgs>(args?: SelectSubset<T, MenuFindFirstOrThrowArgs<ExtArgs>>): Prisma__MenuClient<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Menus that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Menus
     * const menus = await prisma.menu.findMany()
     * 
     * // Get first 10 Menus
     * const menus = await prisma.menu.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const menuWithIdOnly = await prisma.menu.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MenuFindManyArgs>(args?: SelectSubset<T, MenuFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Menu.
     * @param {MenuCreateArgs} args - Arguments to create a Menu.
     * @example
     * // Create one Menu
     * const Menu = await prisma.menu.create({
     *   data: {
     *     // ... data to create a Menu
     *   }
     * })
     * 
     */
    create<T extends MenuCreateArgs>(args: SelectSubset<T, MenuCreateArgs<ExtArgs>>): Prisma__MenuClient<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Menus.
     * @param {MenuCreateManyArgs} args - Arguments to create many Menus.
     * @example
     * // Create many Menus
     * const menu = await prisma.menu.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MenuCreateManyArgs>(args?: SelectSubset<T, MenuCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Menu.
     * @param {MenuDeleteArgs} args - Arguments to delete one Menu.
     * @example
     * // Delete one Menu
     * const Menu = await prisma.menu.delete({
     *   where: {
     *     // ... filter to delete one Menu
     *   }
     * })
     * 
     */
    delete<T extends MenuDeleteArgs>(args: SelectSubset<T, MenuDeleteArgs<ExtArgs>>): Prisma__MenuClient<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Menu.
     * @param {MenuUpdateArgs} args - Arguments to update one Menu.
     * @example
     * // Update one Menu
     * const menu = await prisma.menu.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MenuUpdateArgs>(args: SelectSubset<T, MenuUpdateArgs<ExtArgs>>): Prisma__MenuClient<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Menus.
     * @param {MenuDeleteManyArgs} args - Arguments to filter Menus to delete.
     * @example
     * // Delete a few Menus
     * const { count } = await prisma.menu.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MenuDeleteManyArgs>(args?: SelectSubset<T, MenuDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Menus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Menus
     * const menu = await prisma.menu.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MenuUpdateManyArgs>(args: SelectSubset<T, MenuUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Menu.
     * @param {MenuUpsertArgs} args - Arguments to update or create a Menu.
     * @example
     * // Update or create a Menu
     * const menu = await prisma.menu.upsert({
     *   create: {
     *     // ... data to create a Menu
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Menu we want to update
     *   }
     * })
     */
    upsert<T extends MenuUpsertArgs>(args: SelectSubset<T, MenuUpsertArgs<ExtArgs>>): Prisma__MenuClient<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Menus.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuCountArgs} args - Arguments to filter Menus to count.
     * @example
     * // Count the number of Menus
     * const count = await prisma.menu.count({
     *   where: {
     *     // ... the filter for the Menus we want to count
     *   }
     * })
    **/
    count<T extends MenuCountArgs>(
      args?: Subset<T, MenuCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MenuCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Menu.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MenuAggregateArgs>(args: Subset<T, MenuAggregateArgs>): Prisma.PrismaPromise<GetMenuAggregateType<T>>

    /**
     * Group by Menu.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MenuGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MenuGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MenuGroupByArgs['orderBy'] }
        : { orderBy?: MenuGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MenuGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMenuGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Menu model
   */
  readonly fields: MenuFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Menu.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MenuClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    kategorien<T extends Menu$kategorienArgs<ExtArgs> = {}>(args?: Subset<T, Menu$kategorienArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KategoriePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    restaurant<T extends RestaurantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RestaurantDefaultArgs<ExtArgs>>): Prisma__RestaurantClient<$Result.GetResult<Prisma.$RestaurantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Menu model
   */
  interface MenuFieldRefs {
    readonly id: FieldRef<"Menu", 'Int'>
    readonly name: FieldRef<"Menu", 'String'>
    readonly beschreibung: FieldRef<"Menu", 'String'>
    readonly erstelltAm: FieldRef<"Menu", 'DateTime'>
    readonly aktualisiertAm: FieldRef<"Menu", 'DateTime'>
    readonly restaurantID: FieldRef<"Menu", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Menu findUnique
   */
  export type MenuFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
    /**
     * Filter, which Menu to fetch.
     */
    where: MenuWhereUniqueInput
  }

  /**
   * Menu findUniqueOrThrow
   */
  export type MenuFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
    /**
     * Filter, which Menu to fetch.
     */
    where: MenuWhereUniqueInput
  }

  /**
   * Menu findFirst
   */
  export type MenuFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
    /**
     * Filter, which Menu to fetch.
     */
    where?: MenuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Menus to fetch.
     */
    orderBy?: MenuOrderByWithRelationInput | MenuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Menus.
     */
    cursor?: MenuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Menus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Menus.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Menus.
     */
    distinct?: MenuScalarFieldEnum | MenuScalarFieldEnum[]
  }

  /**
   * Menu findFirstOrThrow
   */
  export type MenuFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
    /**
     * Filter, which Menu to fetch.
     */
    where?: MenuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Menus to fetch.
     */
    orderBy?: MenuOrderByWithRelationInput | MenuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Menus.
     */
    cursor?: MenuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Menus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Menus.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Menus.
     */
    distinct?: MenuScalarFieldEnum | MenuScalarFieldEnum[]
  }

  /**
   * Menu findMany
   */
  export type MenuFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
    /**
     * Filter, which Menus to fetch.
     */
    where?: MenuWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Menus to fetch.
     */
    orderBy?: MenuOrderByWithRelationInput | MenuOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Menus.
     */
    cursor?: MenuWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Menus from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Menus.
     */
    skip?: number
    distinct?: MenuScalarFieldEnum | MenuScalarFieldEnum[]
  }

  /**
   * Menu create
   */
  export type MenuCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
    /**
     * The data needed to create a Menu.
     */
    data: XOR<MenuCreateInput, MenuUncheckedCreateInput>
  }

  /**
   * Menu createMany
   */
  export type MenuCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Menus.
     */
    data: MenuCreateManyInput | MenuCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Menu update
   */
  export type MenuUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
    /**
     * The data needed to update a Menu.
     */
    data: XOR<MenuUpdateInput, MenuUncheckedUpdateInput>
    /**
     * Choose, which Menu to update.
     */
    where: MenuWhereUniqueInput
  }

  /**
   * Menu updateMany
   */
  export type MenuUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Menus.
     */
    data: XOR<MenuUpdateManyMutationInput, MenuUncheckedUpdateManyInput>
    /**
     * Filter which Menus to update
     */
    where?: MenuWhereInput
    /**
     * Limit how many Menus to update.
     */
    limit?: number
  }

  /**
   * Menu upsert
   */
  export type MenuUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
    /**
     * The filter to search for the Menu to update in case it exists.
     */
    where: MenuWhereUniqueInput
    /**
     * In case the Menu found by the `where` argument doesn't exist, create a new Menu with this data.
     */
    create: XOR<MenuCreateInput, MenuUncheckedCreateInput>
    /**
     * In case the Menu was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MenuUpdateInput, MenuUncheckedUpdateInput>
  }

  /**
   * Menu delete
   */
  export type MenuDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
    /**
     * Filter which Menu to delete.
     */
    where: MenuWhereUniqueInput
  }

  /**
   * Menu deleteMany
   */
  export type MenuDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Menus to delete
     */
    where?: MenuWhereInput
    /**
     * Limit how many Menus to delete.
     */
    limit?: number
  }

  /**
   * Menu.kategorien
   */
  export type Menu$kategorienArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kategorie
     */
    select?: KategorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kategorie
     */
    omit?: KategorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KategorieInclude<ExtArgs> | null
    where?: KategorieWhereInput
    orderBy?: KategorieOrderByWithRelationInput | KategorieOrderByWithRelationInput[]
    cursor?: KategorieWhereUniqueInput
    take?: number
    skip?: number
    distinct?: KategorieScalarFieldEnum | KategorieScalarFieldEnum[]
  }

  /**
   * Menu without action
   */
  export type MenuDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Menu
     */
    select?: MenuSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Menu
     */
    omit?: MenuOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MenuInclude<ExtArgs> | null
  }


  /**
   * Model Kategorie
   */

  export type AggregateKategorie = {
    _count: KategorieCountAggregateOutputType | null
    _avg: KategorieAvgAggregateOutputType | null
    _sum: KategorieSumAggregateOutputType | null
    _min: KategorieMinAggregateOutputType | null
    _max: KategorieMaxAggregateOutputType | null
  }

  export type KategorieAvgAggregateOutputType = {
    id: number | null
    menuId: number | null
  }

  export type KategorieSumAggregateOutputType = {
    id: number | null
    menuId: number | null
  }

  export type KategorieMinAggregateOutputType = {
    id: number | null
    name: string | null
    beschreibung: string | null
    menuId: number | null
  }

  export type KategorieMaxAggregateOutputType = {
    id: number | null
    name: string | null
    beschreibung: string | null
    menuId: number | null
  }

  export type KategorieCountAggregateOutputType = {
    id: number
    name: number
    beschreibung: number
    menuId: number
    _all: number
  }


  export type KategorieAvgAggregateInputType = {
    id?: true
    menuId?: true
  }

  export type KategorieSumAggregateInputType = {
    id?: true
    menuId?: true
  }

  export type KategorieMinAggregateInputType = {
    id?: true
    name?: true
    beschreibung?: true
    menuId?: true
  }

  export type KategorieMaxAggregateInputType = {
    id?: true
    name?: true
    beschreibung?: true
    menuId?: true
  }

  export type KategorieCountAggregateInputType = {
    id?: true
    name?: true
    beschreibung?: true
    menuId?: true
    _all?: true
  }

  export type KategorieAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Kategorie to aggregate.
     */
    where?: KategorieWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Kategories to fetch.
     */
    orderBy?: KategorieOrderByWithRelationInput | KategorieOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KategorieWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Kategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Kategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Kategories
    **/
    _count?: true | KategorieCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: KategorieAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: KategorieSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KategorieMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KategorieMaxAggregateInputType
  }

  export type GetKategorieAggregateType<T extends KategorieAggregateArgs> = {
        [P in keyof T & keyof AggregateKategorie]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKategorie[P]>
      : GetScalarType<T[P], AggregateKategorie[P]>
  }




  export type KategorieGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KategorieWhereInput
    orderBy?: KategorieOrderByWithAggregationInput | KategorieOrderByWithAggregationInput[]
    by: KategorieScalarFieldEnum[] | KategorieScalarFieldEnum
    having?: KategorieScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KategorieCountAggregateInputType | true
    _avg?: KategorieAvgAggregateInputType
    _sum?: KategorieSumAggregateInputType
    _min?: KategorieMinAggregateInputType
    _max?: KategorieMaxAggregateInputType
  }

  export type KategorieGroupByOutputType = {
    id: number
    name: string
    beschreibung: string | null
    menuId: number
    _count: KategorieCountAggregateOutputType | null
    _avg: KategorieAvgAggregateOutputType | null
    _sum: KategorieSumAggregateOutputType | null
    _min: KategorieMinAggregateOutputType | null
    _max: KategorieMaxAggregateOutputType | null
  }

  type GetKategorieGroupByPayload<T extends KategorieGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KategorieGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KategorieGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KategorieGroupByOutputType[P]>
            : GetScalarType<T[P], KategorieGroupByOutputType[P]>
        }
      >
    >


  export type KategorieSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    beschreibung?: boolean
    menuId?: boolean
    menu?: boolean | MenuDefaultArgs<ExtArgs>
    gerichte?: boolean | Kategorie$gerichteArgs<ExtArgs>
    _count?: boolean | KategorieCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["kategorie"]>



  export type KategorieSelectScalar = {
    id?: boolean
    name?: boolean
    beschreibung?: boolean
    menuId?: boolean
  }

  export type KategorieOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "beschreibung" | "menuId", ExtArgs["result"]["kategorie"]>
  export type KategorieInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    menu?: boolean | MenuDefaultArgs<ExtArgs>
    gerichte?: boolean | Kategorie$gerichteArgs<ExtArgs>
    _count?: boolean | KategorieCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $KategoriePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Kategorie"
    objects: {
      menu: Prisma.$MenuPayload<ExtArgs>
      gerichte: Prisma.$GerichtPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      beschreibung: string | null
      menuId: number
    }, ExtArgs["result"]["kategorie"]>
    composites: {}
  }

  type KategorieGetPayload<S extends boolean | null | undefined | KategorieDefaultArgs> = $Result.GetResult<Prisma.$KategoriePayload, S>

  type KategorieCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KategorieFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KategorieCountAggregateInputType | true
    }

  export interface KategorieDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Kategorie'], meta: { name: 'Kategorie' } }
    /**
     * Find zero or one Kategorie that matches the filter.
     * @param {KategorieFindUniqueArgs} args - Arguments to find a Kategorie
     * @example
     * // Get one Kategorie
     * const kategorie = await prisma.kategorie.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KategorieFindUniqueArgs>(args: SelectSubset<T, KategorieFindUniqueArgs<ExtArgs>>): Prisma__KategorieClient<$Result.GetResult<Prisma.$KategoriePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Kategorie that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KategorieFindUniqueOrThrowArgs} args - Arguments to find a Kategorie
     * @example
     * // Get one Kategorie
     * const kategorie = await prisma.kategorie.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KategorieFindUniqueOrThrowArgs>(args: SelectSubset<T, KategorieFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KategorieClient<$Result.GetResult<Prisma.$KategoriePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Kategorie that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KategorieFindFirstArgs} args - Arguments to find a Kategorie
     * @example
     * // Get one Kategorie
     * const kategorie = await prisma.kategorie.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KategorieFindFirstArgs>(args?: SelectSubset<T, KategorieFindFirstArgs<ExtArgs>>): Prisma__KategorieClient<$Result.GetResult<Prisma.$KategoriePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Kategorie that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KategorieFindFirstOrThrowArgs} args - Arguments to find a Kategorie
     * @example
     * // Get one Kategorie
     * const kategorie = await prisma.kategorie.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KategorieFindFirstOrThrowArgs>(args?: SelectSubset<T, KategorieFindFirstOrThrowArgs<ExtArgs>>): Prisma__KategorieClient<$Result.GetResult<Prisma.$KategoriePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Kategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KategorieFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Kategories
     * const kategories = await prisma.kategorie.findMany()
     * 
     * // Get first 10 Kategories
     * const kategories = await prisma.kategorie.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const kategorieWithIdOnly = await prisma.kategorie.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KategorieFindManyArgs>(args?: SelectSubset<T, KategorieFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KategoriePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Kategorie.
     * @param {KategorieCreateArgs} args - Arguments to create a Kategorie.
     * @example
     * // Create one Kategorie
     * const Kategorie = await prisma.kategorie.create({
     *   data: {
     *     // ... data to create a Kategorie
     *   }
     * })
     * 
     */
    create<T extends KategorieCreateArgs>(args: SelectSubset<T, KategorieCreateArgs<ExtArgs>>): Prisma__KategorieClient<$Result.GetResult<Prisma.$KategoriePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Kategories.
     * @param {KategorieCreateManyArgs} args - Arguments to create many Kategories.
     * @example
     * // Create many Kategories
     * const kategorie = await prisma.kategorie.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KategorieCreateManyArgs>(args?: SelectSubset<T, KategorieCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Kategorie.
     * @param {KategorieDeleteArgs} args - Arguments to delete one Kategorie.
     * @example
     * // Delete one Kategorie
     * const Kategorie = await prisma.kategorie.delete({
     *   where: {
     *     // ... filter to delete one Kategorie
     *   }
     * })
     * 
     */
    delete<T extends KategorieDeleteArgs>(args: SelectSubset<T, KategorieDeleteArgs<ExtArgs>>): Prisma__KategorieClient<$Result.GetResult<Prisma.$KategoriePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Kategorie.
     * @param {KategorieUpdateArgs} args - Arguments to update one Kategorie.
     * @example
     * // Update one Kategorie
     * const kategorie = await prisma.kategorie.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KategorieUpdateArgs>(args: SelectSubset<T, KategorieUpdateArgs<ExtArgs>>): Prisma__KategorieClient<$Result.GetResult<Prisma.$KategoriePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Kategories.
     * @param {KategorieDeleteManyArgs} args - Arguments to filter Kategories to delete.
     * @example
     * // Delete a few Kategories
     * const { count } = await prisma.kategorie.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KategorieDeleteManyArgs>(args?: SelectSubset<T, KategorieDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Kategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KategorieUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Kategories
     * const kategorie = await prisma.kategorie.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KategorieUpdateManyArgs>(args: SelectSubset<T, KategorieUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Kategorie.
     * @param {KategorieUpsertArgs} args - Arguments to update or create a Kategorie.
     * @example
     * // Update or create a Kategorie
     * const kategorie = await prisma.kategorie.upsert({
     *   create: {
     *     // ... data to create a Kategorie
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Kategorie we want to update
     *   }
     * })
     */
    upsert<T extends KategorieUpsertArgs>(args: SelectSubset<T, KategorieUpsertArgs<ExtArgs>>): Prisma__KategorieClient<$Result.GetResult<Prisma.$KategoriePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Kategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KategorieCountArgs} args - Arguments to filter Kategories to count.
     * @example
     * // Count the number of Kategories
     * const count = await prisma.kategorie.count({
     *   where: {
     *     // ... the filter for the Kategories we want to count
     *   }
     * })
    **/
    count<T extends KategorieCountArgs>(
      args?: Subset<T, KategorieCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KategorieCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Kategorie.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KategorieAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KategorieAggregateArgs>(args: Subset<T, KategorieAggregateArgs>): Prisma.PrismaPromise<GetKategorieAggregateType<T>>

    /**
     * Group by Kategorie.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KategorieGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KategorieGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KategorieGroupByArgs['orderBy'] }
        : { orderBy?: KategorieGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KategorieGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKategorieGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Kategorie model
   */
  readonly fields: KategorieFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Kategorie.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KategorieClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    menu<T extends MenuDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MenuDefaultArgs<ExtArgs>>): Prisma__MenuClient<$Result.GetResult<Prisma.$MenuPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    gerichte<T extends Kategorie$gerichteArgs<ExtArgs> = {}>(args?: Subset<T, Kategorie$gerichteArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GerichtPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Kategorie model
   */
  interface KategorieFieldRefs {
    readonly id: FieldRef<"Kategorie", 'Int'>
    readonly name: FieldRef<"Kategorie", 'String'>
    readonly beschreibung: FieldRef<"Kategorie", 'String'>
    readonly menuId: FieldRef<"Kategorie", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Kategorie findUnique
   */
  export type KategorieFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kategorie
     */
    select?: KategorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kategorie
     */
    omit?: KategorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KategorieInclude<ExtArgs> | null
    /**
     * Filter, which Kategorie to fetch.
     */
    where: KategorieWhereUniqueInput
  }

  /**
   * Kategorie findUniqueOrThrow
   */
  export type KategorieFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kategorie
     */
    select?: KategorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kategorie
     */
    omit?: KategorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KategorieInclude<ExtArgs> | null
    /**
     * Filter, which Kategorie to fetch.
     */
    where: KategorieWhereUniqueInput
  }

  /**
   * Kategorie findFirst
   */
  export type KategorieFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kategorie
     */
    select?: KategorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kategorie
     */
    omit?: KategorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KategorieInclude<ExtArgs> | null
    /**
     * Filter, which Kategorie to fetch.
     */
    where?: KategorieWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Kategories to fetch.
     */
    orderBy?: KategorieOrderByWithRelationInput | KategorieOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Kategories.
     */
    cursor?: KategorieWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Kategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Kategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Kategories.
     */
    distinct?: KategorieScalarFieldEnum | KategorieScalarFieldEnum[]
  }

  /**
   * Kategorie findFirstOrThrow
   */
  export type KategorieFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kategorie
     */
    select?: KategorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kategorie
     */
    omit?: KategorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KategorieInclude<ExtArgs> | null
    /**
     * Filter, which Kategorie to fetch.
     */
    where?: KategorieWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Kategories to fetch.
     */
    orderBy?: KategorieOrderByWithRelationInput | KategorieOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Kategories.
     */
    cursor?: KategorieWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Kategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Kategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Kategories.
     */
    distinct?: KategorieScalarFieldEnum | KategorieScalarFieldEnum[]
  }

  /**
   * Kategorie findMany
   */
  export type KategorieFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kategorie
     */
    select?: KategorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kategorie
     */
    omit?: KategorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KategorieInclude<ExtArgs> | null
    /**
     * Filter, which Kategories to fetch.
     */
    where?: KategorieWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Kategories to fetch.
     */
    orderBy?: KategorieOrderByWithRelationInput | KategorieOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Kategories.
     */
    cursor?: KategorieWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Kategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Kategories.
     */
    skip?: number
    distinct?: KategorieScalarFieldEnum | KategorieScalarFieldEnum[]
  }

  /**
   * Kategorie create
   */
  export type KategorieCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kategorie
     */
    select?: KategorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kategorie
     */
    omit?: KategorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KategorieInclude<ExtArgs> | null
    /**
     * The data needed to create a Kategorie.
     */
    data: XOR<KategorieCreateInput, KategorieUncheckedCreateInput>
  }

  /**
   * Kategorie createMany
   */
  export type KategorieCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Kategories.
     */
    data: KategorieCreateManyInput | KategorieCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Kategorie update
   */
  export type KategorieUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kategorie
     */
    select?: KategorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kategorie
     */
    omit?: KategorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KategorieInclude<ExtArgs> | null
    /**
     * The data needed to update a Kategorie.
     */
    data: XOR<KategorieUpdateInput, KategorieUncheckedUpdateInput>
    /**
     * Choose, which Kategorie to update.
     */
    where: KategorieWhereUniqueInput
  }

  /**
   * Kategorie updateMany
   */
  export type KategorieUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Kategories.
     */
    data: XOR<KategorieUpdateManyMutationInput, KategorieUncheckedUpdateManyInput>
    /**
     * Filter which Kategories to update
     */
    where?: KategorieWhereInput
    /**
     * Limit how many Kategories to update.
     */
    limit?: number
  }

  /**
   * Kategorie upsert
   */
  export type KategorieUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kategorie
     */
    select?: KategorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kategorie
     */
    omit?: KategorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KategorieInclude<ExtArgs> | null
    /**
     * The filter to search for the Kategorie to update in case it exists.
     */
    where: KategorieWhereUniqueInput
    /**
     * In case the Kategorie found by the `where` argument doesn't exist, create a new Kategorie with this data.
     */
    create: XOR<KategorieCreateInput, KategorieUncheckedCreateInput>
    /**
     * In case the Kategorie was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KategorieUpdateInput, KategorieUncheckedUpdateInput>
  }

  /**
   * Kategorie delete
   */
  export type KategorieDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kategorie
     */
    select?: KategorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kategorie
     */
    omit?: KategorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KategorieInclude<ExtArgs> | null
    /**
     * Filter which Kategorie to delete.
     */
    where: KategorieWhereUniqueInput
  }

  /**
   * Kategorie deleteMany
   */
  export type KategorieDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Kategories to delete
     */
    where?: KategorieWhereInput
    /**
     * Limit how many Kategories to delete.
     */
    limit?: number
  }

  /**
   * Kategorie.gerichte
   */
  export type Kategorie$gerichteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gericht
     */
    select?: GerichtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gericht
     */
    omit?: GerichtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GerichtInclude<ExtArgs> | null
    where?: GerichtWhereInput
    orderBy?: GerichtOrderByWithRelationInput | GerichtOrderByWithRelationInput[]
    cursor?: GerichtWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GerichtScalarFieldEnum | GerichtScalarFieldEnum[]
  }

  /**
   * Kategorie without action
   */
  export type KategorieDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Kategorie
     */
    select?: KategorieSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Kategorie
     */
    omit?: KategorieOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: KategorieInclude<ExtArgs> | null
  }


  /**
   * Model Gericht
   */

  export type AggregateGericht = {
    _count: GerichtCountAggregateOutputType | null
    _avg: GerichtAvgAggregateOutputType | null
    _sum: GerichtSumAggregateOutputType | null
    _min: GerichtMinAggregateOutputType | null
    _max: GerichtMaxAggregateOutputType | null
  }

  export type GerichtAvgAggregateOutputType = {
    id: number | null
    preis: number | null
    kategorieId: number | null
  }

  export type GerichtSumAggregateOutputType = {
    id: number | null
    preis: number | null
    kategorieId: number | null
  }

  export type GerichtMinAggregateOutputType = {
    id: number | null
    name: string | null
    beschreibung: string | null
    preis: number | null
    kategorieId: number | null
    erstelltAm: Date | null
    aktualisiertAm: Date | null
    img: string | null
  }

  export type GerichtMaxAggregateOutputType = {
    id: number | null
    name: string | null
    beschreibung: string | null
    preis: number | null
    kategorieId: number | null
    erstelltAm: Date | null
    aktualisiertAm: Date | null
    img: string | null
  }

  export type GerichtCountAggregateOutputType = {
    id: number
    name: number
    beschreibung: number
    preis: number
    kategorieId: number
    erstelltAm: number
    aktualisiertAm: number
    img: number
    _all: number
  }


  export type GerichtAvgAggregateInputType = {
    id?: true
    preis?: true
    kategorieId?: true
  }

  export type GerichtSumAggregateInputType = {
    id?: true
    preis?: true
    kategorieId?: true
  }

  export type GerichtMinAggregateInputType = {
    id?: true
    name?: true
    beschreibung?: true
    preis?: true
    kategorieId?: true
    erstelltAm?: true
    aktualisiertAm?: true
    img?: true
  }

  export type GerichtMaxAggregateInputType = {
    id?: true
    name?: true
    beschreibung?: true
    preis?: true
    kategorieId?: true
    erstelltAm?: true
    aktualisiertAm?: true
    img?: true
  }

  export type GerichtCountAggregateInputType = {
    id?: true
    name?: true
    beschreibung?: true
    preis?: true
    kategorieId?: true
    erstelltAm?: true
    aktualisiertAm?: true
    img?: true
    _all?: true
  }

  export type GerichtAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Gericht to aggregate.
     */
    where?: GerichtWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gerichts to fetch.
     */
    orderBy?: GerichtOrderByWithRelationInput | GerichtOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GerichtWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gerichts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gerichts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Gerichts
    **/
    _count?: true | GerichtCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GerichtAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GerichtSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GerichtMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GerichtMaxAggregateInputType
  }

  export type GetGerichtAggregateType<T extends GerichtAggregateArgs> = {
        [P in keyof T & keyof AggregateGericht]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGericht[P]>
      : GetScalarType<T[P], AggregateGericht[P]>
  }




  export type GerichtGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GerichtWhereInput
    orderBy?: GerichtOrderByWithAggregationInput | GerichtOrderByWithAggregationInput[]
    by: GerichtScalarFieldEnum[] | GerichtScalarFieldEnum
    having?: GerichtScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GerichtCountAggregateInputType | true
    _avg?: GerichtAvgAggregateInputType
    _sum?: GerichtSumAggregateInputType
    _min?: GerichtMinAggregateInputType
    _max?: GerichtMaxAggregateInputType
  }

  export type GerichtGroupByOutputType = {
    id: number
    name: string
    beschreibung: string | null
    preis: number
    kategorieId: number
    erstelltAm: Date
    aktualisiertAm: Date
    img: string
    _count: GerichtCountAggregateOutputType | null
    _avg: GerichtAvgAggregateOutputType | null
    _sum: GerichtSumAggregateOutputType | null
    _min: GerichtMinAggregateOutputType | null
    _max: GerichtMaxAggregateOutputType | null
  }

  type GetGerichtGroupByPayload<T extends GerichtGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GerichtGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GerichtGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GerichtGroupByOutputType[P]>
            : GetScalarType<T[P], GerichtGroupByOutputType[P]>
        }
      >
    >


  export type GerichtSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    beschreibung?: boolean
    preis?: boolean
    kategorieId?: boolean
    erstelltAm?: boolean
    aktualisiertAm?: boolean
    img?: boolean
    kategorie?: boolean | KategorieDefaultArgs<ExtArgs>
    zutaten?: boolean | Gericht$zutatenArgs<ExtArgs>
    Bewertung?: boolean | Gericht$BewertungArgs<ExtArgs>
    _count?: boolean | GerichtCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gericht"]>



  export type GerichtSelectScalar = {
    id?: boolean
    name?: boolean
    beschreibung?: boolean
    preis?: boolean
    kategorieId?: boolean
    erstelltAm?: boolean
    aktualisiertAm?: boolean
    img?: boolean
  }

  export type GerichtOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "beschreibung" | "preis" | "kategorieId" | "erstelltAm" | "aktualisiertAm" | "img", ExtArgs["result"]["gericht"]>
  export type GerichtInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    kategorie?: boolean | KategorieDefaultArgs<ExtArgs>
    zutaten?: boolean | Gericht$zutatenArgs<ExtArgs>
    Bewertung?: boolean | Gericht$BewertungArgs<ExtArgs>
    _count?: boolean | GerichtCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $GerichtPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Gericht"
    objects: {
      kategorie: Prisma.$KategoriePayload<ExtArgs>
      zutaten: Prisma.$ZutatPayload<ExtArgs>[]
      Bewertung: Prisma.$BewertungPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      beschreibung: string | null
      preis: number
      kategorieId: number
      erstelltAm: Date
      aktualisiertAm: Date
      img: string
    }, ExtArgs["result"]["gericht"]>
    composites: {}
  }

  type GerichtGetPayload<S extends boolean | null | undefined | GerichtDefaultArgs> = $Result.GetResult<Prisma.$GerichtPayload, S>

  type GerichtCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GerichtFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GerichtCountAggregateInputType | true
    }

  export interface GerichtDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Gericht'], meta: { name: 'Gericht' } }
    /**
     * Find zero or one Gericht that matches the filter.
     * @param {GerichtFindUniqueArgs} args - Arguments to find a Gericht
     * @example
     * // Get one Gericht
     * const gericht = await prisma.gericht.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GerichtFindUniqueArgs>(args: SelectSubset<T, GerichtFindUniqueArgs<ExtArgs>>): Prisma__GerichtClient<$Result.GetResult<Prisma.$GerichtPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Gericht that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GerichtFindUniqueOrThrowArgs} args - Arguments to find a Gericht
     * @example
     * // Get one Gericht
     * const gericht = await prisma.gericht.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GerichtFindUniqueOrThrowArgs>(args: SelectSubset<T, GerichtFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GerichtClient<$Result.GetResult<Prisma.$GerichtPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Gericht that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GerichtFindFirstArgs} args - Arguments to find a Gericht
     * @example
     * // Get one Gericht
     * const gericht = await prisma.gericht.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GerichtFindFirstArgs>(args?: SelectSubset<T, GerichtFindFirstArgs<ExtArgs>>): Prisma__GerichtClient<$Result.GetResult<Prisma.$GerichtPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Gericht that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GerichtFindFirstOrThrowArgs} args - Arguments to find a Gericht
     * @example
     * // Get one Gericht
     * const gericht = await prisma.gericht.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GerichtFindFirstOrThrowArgs>(args?: SelectSubset<T, GerichtFindFirstOrThrowArgs<ExtArgs>>): Prisma__GerichtClient<$Result.GetResult<Prisma.$GerichtPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Gerichts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GerichtFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Gerichts
     * const gerichts = await prisma.gericht.findMany()
     * 
     * // Get first 10 Gerichts
     * const gerichts = await prisma.gericht.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gerichtWithIdOnly = await prisma.gericht.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GerichtFindManyArgs>(args?: SelectSubset<T, GerichtFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GerichtPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Gericht.
     * @param {GerichtCreateArgs} args - Arguments to create a Gericht.
     * @example
     * // Create one Gericht
     * const Gericht = await prisma.gericht.create({
     *   data: {
     *     // ... data to create a Gericht
     *   }
     * })
     * 
     */
    create<T extends GerichtCreateArgs>(args: SelectSubset<T, GerichtCreateArgs<ExtArgs>>): Prisma__GerichtClient<$Result.GetResult<Prisma.$GerichtPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Gerichts.
     * @param {GerichtCreateManyArgs} args - Arguments to create many Gerichts.
     * @example
     * // Create many Gerichts
     * const gericht = await prisma.gericht.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GerichtCreateManyArgs>(args?: SelectSubset<T, GerichtCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Gericht.
     * @param {GerichtDeleteArgs} args - Arguments to delete one Gericht.
     * @example
     * // Delete one Gericht
     * const Gericht = await prisma.gericht.delete({
     *   where: {
     *     // ... filter to delete one Gericht
     *   }
     * })
     * 
     */
    delete<T extends GerichtDeleteArgs>(args: SelectSubset<T, GerichtDeleteArgs<ExtArgs>>): Prisma__GerichtClient<$Result.GetResult<Prisma.$GerichtPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Gericht.
     * @param {GerichtUpdateArgs} args - Arguments to update one Gericht.
     * @example
     * // Update one Gericht
     * const gericht = await prisma.gericht.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GerichtUpdateArgs>(args: SelectSubset<T, GerichtUpdateArgs<ExtArgs>>): Prisma__GerichtClient<$Result.GetResult<Prisma.$GerichtPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Gerichts.
     * @param {GerichtDeleteManyArgs} args - Arguments to filter Gerichts to delete.
     * @example
     * // Delete a few Gerichts
     * const { count } = await prisma.gericht.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GerichtDeleteManyArgs>(args?: SelectSubset<T, GerichtDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Gerichts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GerichtUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Gerichts
     * const gericht = await prisma.gericht.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GerichtUpdateManyArgs>(args: SelectSubset<T, GerichtUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Gericht.
     * @param {GerichtUpsertArgs} args - Arguments to update or create a Gericht.
     * @example
     * // Update or create a Gericht
     * const gericht = await prisma.gericht.upsert({
     *   create: {
     *     // ... data to create a Gericht
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Gericht we want to update
     *   }
     * })
     */
    upsert<T extends GerichtUpsertArgs>(args: SelectSubset<T, GerichtUpsertArgs<ExtArgs>>): Prisma__GerichtClient<$Result.GetResult<Prisma.$GerichtPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Gerichts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GerichtCountArgs} args - Arguments to filter Gerichts to count.
     * @example
     * // Count the number of Gerichts
     * const count = await prisma.gericht.count({
     *   where: {
     *     // ... the filter for the Gerichts we want to count
     *   }
     * })
    **/
    count<T extends GerichtCountArgs>(
      args?: Subset<T, GerichtCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GerichtCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Gericht.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GerichtAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GerichtAggregateArgs>(args: Subset<T, GerichtAggregateArgs>): Prisma.PrismaPromise<GetGerichtAggregateType<T>>

    /**
     * Group by Gericht.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GerichtGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GerichtGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GerichtGroupByArgs['orderBy'] }
        : { orderBy?: GerichtGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GerichtGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGerichtGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Gericht model
   */
  readonly fields: GerichtFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Gericht.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GerichtClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    kategorie<T extends KategorieDefaultArgs<ExtArgs> = {}>(args?: Subset<T, KategorieDefaultArgs<ExtArgs>>): Prisma__KategorieClient<$Result.GetResult<Prisma.$KategoriePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    zutaten<T extends Gericht$zutatenArgs<ExtArgs> = {}>(args?: Subset<T, Gericht$zutatenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZutatPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Bewertung<T extends Gericht$BewertungArgs<ExtArgs> = {}>(args?: Subset<T, Gericht$BewertungArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BewertungPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Gericht model
   */
  interface GerichtFieldRefs {
    readonly id: FieldRef<"Gericht", 'Int'>
    readonly name: FieldRef<"Gericht", 'String'>
    readonly beschreibung: FieldRef<"Gericht", 'String'>
    readonly preis: FieldRef<"Gericht", 'Float'>
    readonly kategorieId: FieldRef<"Gericht", 'Int'>
    readonly erstelltAm: FieldRef<"Gericht", 'DateTime'>
    readonly aktualisiertAm: FieldRef<"Gericht", 'DateTime'>
    readonly img: FieldRef<"Gericht", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Gericht findUnique
   */
  export type GerichtFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gericht
     */
    select?: GerichtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gericht
     */
    omit?: GerichtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GerichtInclude<ExtArgs> | null
    /**
     * Filter, which Gericht to fetch.
     */
    where: GerichtWhereUniqueInput
  }

  /**
   * Gericht findUniqueOrThrow
   */
  export type GerichtFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gericht
     */
    select?: GerichtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gericht
     */
    omit?: GerichtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GerichtInclude<ExtArgs> | null
    /**
     * Filter, which Gericht to fetch.
     */
    where: GerichtWhereUniqueInput
  }

  /**
   * Gericht findFirst
   */
  export type GerichtFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gericht
     */
    select?: GerichtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gericht
     */
    omit?: GerichtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GerichtInclude<ExtArgs> | null
    /**
     * Filter, which Gericht to fetch.
     */
    where?: GerichtWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gerichts to fetch.
     */
    orderBy?: GerichtOrderByWithRelationInput | GerichtOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Gerichts.
     */
    cursor?: GerichtWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gerichts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gerichts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Gerichts.
     */
    distinct?: GerichtScalarFieldEnum | GerichtScalarFieldEnum[]
  }

  /**
   * Gericht findFirstOrThrow
   */
  export type GerichtFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gericht
     */
    select?: GerichtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gericht
     */
    omit?: GerichtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GerichtInclude<ExtArgs> | null
    /**
     * Filter, which Gericht to fetch.
     */
    where?: GerichtWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gerichts to fetch.
     */
    orderBy?: GerichtOrderByWithRelationInput | GerichtOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Gerichts.
     */
    cursor?: GerichtWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gerichts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gerichts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Gerichts.
     */
    distinct?: GerichtScalarFieldEnum | GerichtScalarFieldEnum[]
  }

  /**
   * Gericht findMany
   */
  export type GerichtFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gericht
     */
    select?: GerichtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gericht
     */
    omit?: GerichtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GerichtInclude<ExtArgs> | null
    /**
     * Filter, which Gerichts to fetch.
     */
    where?: GerichtWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Gerichts to fetch.
     */
    orderBy?: GerichtOrderByWithRelationInput | GerichtOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Gerichts.
     */
    cursor?: GerichtWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Gerichts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Gerichts.
     */
    skip?: number
    distinct?: GerichtScalarFieldEnum | GerichtScalarFieldEnum[]
  }

  /**
   * Gericht create
   */
  export type GerichtCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gericht
     */
    select?: GerichtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gericht
     */
    omit?: GerichtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GerichtInclude<ExtArgs> | null
    /**
     * The data needed to create a Gericht.
     */
    data: XOR<GerichtCreateInput, GerichtUncheckedCreateInput>
  }

  /**
   * Gericht createMany
   */
  export type GerichtCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Gerichts.
     */
    data: GerichtCreateManyInput | GerichtCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Gericht update
   */
  export type GerichtUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gericht
     */
    select?: GerichtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gericht
     */
    omit?: GerichtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GerichtInclude<ExtArgs> | null
    /**
     * The data needed to update a Gericht.
     */
    data: XOR<GerichtUpdateInput, GerichtUncheckedUpdateInput>
    /**
     * Choose, which Gericht to update.
     */
    where: GerichtWhereUniqueInput
  }

  /**
   * Gericht updateMany
   */
  export type GerichtUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Gerichts.
     */
    data: XOR<GerichtUpdateManyMutationInput, GerichtUncheckedUpdateManyInput>
    /**
     * Filter which Gerichts to update
     */
    where?: GerichtWhereInput
    /**
     * Limit how many Gerichts to update.
     */
    limit?: number
  }

  /**
   * Gericht upsert
   */
  export type GerichtUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gericht
     */
    select?: GerichtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gericht
     */
    omit?: GerichtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GerichtInclude<ExtArgs> | null
    /**
     * The filter to search for the Gericht to update in case it exists.
     */
    where: GerichtWhereUniqueInput
    /**
     * In case the Gericht found by the `where` argument doesn't exist, create a new Gericht with this data.
     */
    create: XOR<GerichtCreateInput, GerichtUncheckedCreateInput>
    /**
     * In case the Gericht was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GerichtUpdateInput, GerichtUncheckedUpdateInput>
  }

  /**
   * Gericht delete
   */
  export type GerichtDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gericht
     */
    select?: GerichtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gericht
     */
    omit?: GerichtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GerichtInclude<ExtArgs> | null
    /**
     * Filter which Gericht to delete.
     */
    where: GerichtWhereUniqueInput
  }

  /**
   * Gericht deleteMany
   */
  export type GerichtDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Gerichts to delete
     */
    where?: GerichtWhereInput
    /**
     * Limit how many Gerichts to delete.
     */
    limit?: number
  }

  /**
   * Gericht.zutaten
   */
  export type Gericht$zutatenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Zutat
     */
    select?: ZutatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Zutat
     */
    omit?: ZutatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZutatInclude<ExtArgs> | null
    where?: ZutatWhereInput
    orderBy?: ZutatOrderByWithRelationInput | ZutatOrderByWithRelationInput[]
    cursor?: ZutatWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ZutatScalarFieldEnum | ZutatScalarFieldEnum[]
  }

  /**
   * Gericht.Bewertung
   */
  export type Gericht$BewertungArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bewertung
     */
    select?: BewertungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bewertung
     */
    omit?: BewertungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BewertungInclude<ExtArgs> | null
    where?: BewertungWhereInput
    orderBy?: BewertungOrderByWithRelationInput | BewertungOrderByWithRelationInput[]
    cursor?: BewertungWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BewertungScalarFieldEnum | BewertungScalarFieldEnum[]
  }

  /**
   * Gericht without action
   */
  export type GerichtDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gericht
     */
    select?: GerichtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gericht
     */
    omit?: GerichtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GerichtInclude<ExtArgs> | null
  }


  /**
   * Model Zutat
   */

  export type AggregateZutat = {
    _count: ZutatCountAggregateOutputType | null
    _avg: ZutatAvgAggregateOutputType | null
    _sum: ZutatSumAggregateOutputType | null
    _min: ZutatMinAggregateOutputType | null
    _max: ZutatMaxAggregateOutputType | null
  }

  export type ZutatAvgAggregateOutputType = {
    id: number | null
  }

  export type ZutatSumAggregateOutputType = {
    id: number | null
  }

  export type ZutatMinAggregateOutputType = {
    id: number | null
    name: string | null
    istAllergen: boolean | null
  }

  export type ZutatMaxAggregateOutputType = {
    id: number | null
    name: string | null
    istAllergen: boolean | null
  }

  export type ZutatCountAggregateOutputType = {
    id: number
    name: number
    istAllergen: number
    _all: number
  }


  export type ZutatAvgAggregateInputType = {
    id?: true
  }

  export type ZutatSumAggregateInputType = {
    id?: true
  }

  export type ZutatMinAggregateInputType = {
    id?: true
    name?: true
    istAllergen?: true
  }

  export type ZutatMaxAggregateInputType = {
    id?: true
    name?: true
    istAllergen?: true
  }

  export type ZutatCountAggregateInputType = {
    id?: true
    name?: true
    istAllergen?: true
    _all?: true
  }

  export type ZutatAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Zutat to aggregate.
     */
    where?: ZutatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Zutats to fetch.
     */
    orderBy?: ZutatOrderByWithRelationInput | ZutatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ZutatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Zutats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Zutats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Zutats
    **/
    _count?: true | ZutatCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ZutatAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ZutatSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ZutatMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ZutatMaxAggregateInputType
  }

  export type GetZutatAggregateType<T extends ZutatAggregateArgs> = {
        [P in keyof T & keyof AggregateZutat]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateZutat[P]>
      : GetScalarType<T[P], AggregateZutat[P]>
  }




  export type ZutatGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ZutatWhereInput
    orderBy?: ZutatOrderByWithAggregationInput | ZutatOrderByWithAggregationInput[]
    by: ZutatScalarFieldEnum[] | ZutatScalarFieldEnum
    having?: ZutatScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ZutatCountAggregateInputType | true
    _avg?: ZutatAvgAggregateInputType
    _sum?: ZutatSumAggregateInputType
    _min?: ZutatMinAggregateInputType
    _max?: ZutatMaxAggregateInputType
  }

  export type ZutatGroupByOutputType = {
    id: number
    name: string
    istAllergen: boolean
    _count: ZutatCountAggregateOutputType | null
    _avg: ZutatAvgAggregateOutputType | null
    _sum: ZutatSumAggregateOutputType | null
    _min: ZutatMinAggregateOutputType | null
    _max: ZutatMaxAggregateOutputType | null
  }

  type GetZutatGroupByPayload<T extends ZutatGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ZutatGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ZutatGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ZutatGroupByOutputType[P]>
            : GetScalarType<T[P], ZutatGroupByOutputType[P]>
        }
      >
    >


  export type ZutatSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    istAllergen?: boolean
    gerichte?: boolean | Zutat$gerichteArgs<ExtArgs>
    _count?: boolean | ZutatCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["zutat"]>



  export type ZutatSelectScalar = {
    id?: boolean
    name?: boolean
    istAllergen?: boolean
  }

  export type ZutatOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "istAllergen", ExtArgs["result"]["zutat"]>
  export type ZutatInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gerichte?: boolean | Zutat$gerichteArgs<ExtArgs>
    _count?: boolean | ZutatCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ZutatPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Zutat"
    objects: {
      gerichte: Prisma.$GerichtPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      istAllergen: boolean
    }, ExtArgs["result"]["zutat"]>
    composites: {}
  }

  type ZutatGetPayload<S extends boolean | null | undefined | ZutatDefaultArgs> = $Result.GetResult<Prisma.$ZutatPayload, S>

  type ZutatCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ZutatFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ZutatCountAggregateInputType | true
    }

  export interface ZutatDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Zutat'], meta: { name: 'Zutat' } }
    /**
     * Find zero or one Zutat that matches the filter.
     * @param {ZutatFindUniqueArgs} args - Arguments to find a Zutat
     * @example
     * // Get one Zutat
     * const zutat = await prisma.zutat.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ZutatFindUniqueArgs>(args: SelectSubset<T, ZutatFindUniqueArgs<ExtArgs>>): Prisma__ZutatClient<$Result.GetResult<Prisma.$ZutatPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Zutat that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ZutatFindUniqueOrThrowArgs} args - Arguments to find a Zutat
     * @example
     * // Get one Zutat
     * const zutat = await prisma.zutat.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ZutatFindUniqueOrThrowArgs>(args: SelectSubset<T, ZutatFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ZutatClient<$Result.GetResult<Prisma.$ZutatPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Zutat that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZutatFindFirstArgs} args - Arguments to find a Zutat
     * @example
     * // Get one Zutat
     * const zutat = await prisma.zutat.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ZutatFindFirstArgs>(args?: SelectSubset<T, ZutatFindFirstArgs<ExtArgs>>): Prisma__ZutatClient<$Result.GetResult<Prisma.$ZutatPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Zutat that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZutatFindFirstOrThrowArgs} args - Arguments to find a Zutat
     * @example
     * // Get one Zutat
     * const zutat = await prisma.zutat.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ZutatFindFirstOrThrowArgs>(args?: SelectSubset<T, ZutatFindFirstOrThrowArgs<ExtArgs>>): Prisma__ZutatClient<$Result.GetResult<Prisma.$ZutatPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Zutats that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZutatFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Zutats
     * const zutats = await prisma.zutat.findMany()
     * 
     * // Get first 10 Zutats
     * const zutats = await prisma.zutat.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const zutatWithIdOnly = await prisma.zutat.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ZutatFindManyArgs>(args?: SelectSubset<T, ZutatFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ZutatPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Zutat.
     * @param {ZutatCreateArgs} args - Arguments to create a Zutat.
     * @example
     * // Create one Zutat
     * const Zutat = await prisma.zutat.create({
     *   data: {
     *     // ... data to create a Zutat
     *   }
     * })
     * 
     */
    create<T extends ZutatCreateArgs>(args: SelectSubset<T, ZutatCreateArgs<ExtArgs>>): Prisma__ZutatClient<$Result.GetResult<Prisma.$ZutatPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Zutats.
     * @param {ZutatCreateManyArgs} args - Arguments to create many Zutats.
     * @example
     * // Create many Zutats
     * const zutat = await prisma.zutat.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ZutatCreateManyArgs>(args?: SelectSubset<T, ZutatCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Zutat.
     * @param {ZutatDeleteArgs} args - Arguments to delete one Zutat.
     * @example
     * // Delete one Zutat
     * const Zutat = await prisma.zutat.delete({
     *   where: {
     *     // ... filter to delete one Zutat
     *   }
     * })
     * 
     */
    delete<T extends ZutatDeleteArgs>(args: SelectSubset<T, ZutatDeleteArgs<ExtArgs>>): Prisma__ZutatClient<$Result.GetResult<Prisma.$ZutatPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Zutat.
     * @param {ZutatUpdateArgs} args - Arguments to update one Zutat.
     * @example
     * // Update one Zutat
     * const zutat = await prisma.zutat.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ZutatUpdateArgs>(args: SelectSubset<T, ZutatUpdateArgs<ExtArgs>>): Prisma__ZutatClient<$Result.GetResult<Prisma.$ZutatPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Zutats.
     * @param {ZutatDeleteManyArgs} args - Arguments to filter Zutats to delete.
     * @example
     * // Delete a few Zutats
     * const { count } = await prisma.zutat.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ZutatDeleteManyArgs>(args?: SelectSubset<T, ZutatDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Zutats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZutatUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Zutats
     * const zutat = await prisma.zutat.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ZutatUpdateManyArgs>(args: SelectSubset<T, ZutatUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Zutat.
     * @param {ZutatUpsertArgs} args - Arguments to update or create a Zutat.
     * @example
     * // Update or create a Zutat
     * const zutat = await prisma.zutat.upsert({
     *   create: {
     *     // ... data to create a Zutat
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Zutat we want to update
     *   }
     * })
     */
    upsert<T extends ZutatUpsertArgs>(args: SelectSubset<T, ZutatUpsertArgs<ExtArgs>>): Prisma__ZutatClient<$Result.GetResult<Prisma.$ZutatPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Zutats.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZutatCountArgs} args - Arguments to filter Zutats to count.
     * @example
     * // Count the number of Zutats
     * const count = await prisma.zutat.count({
     *   where: {
     *     // ... the filter for the Zutats we want to count
     *   }
     * })
    **/
    count<T extends ZutatCountArgs>(
      args?: Subset<T, ZutatCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ZutatCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Zutat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZutatAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ZutatAggregateArgs>(args: Subset<T, ZutatAggregateArgs>): Prisma.PrismaPromise<GetZutatAggregateType<T>>

    /**
     * Group by Zutat.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ZutatGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ZutatGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ZutatGroupByArgs['orderBy'] }
        : { orderBy?: ZutatGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ZutatGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetZutatGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Zutat model
   */
  readonly fields: ZutatFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Zutat.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ZutatClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    gerichte<T extends Zutat$gerichteArgs<ExtArgs> = {}>(args?: Subset<T, Zutat$gerichteArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GerichtPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Zutat model
   */
  interface ZutatFieldRefs {
    readonly id: FieldRef<"Zutat", 'Int'>
    readonly name: FieldRef<"Zutat", 'String'>
    readonly istAllergen: FieldRef<"Zutat", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Zutat findUnique
   */
  export type ZutatFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Zutat
     */
    select?: ZutatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Zutat
     */
    omit?: ZutatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZutatInclude<ExtArgs> | null
    /**
     * Filter, which Zutat to fetch.
     */
    where: ZutatWhereUniqueInput
  }

  /**
   * Zutat findUniqueOrThrow
   */
  export type ZutatFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Zutat
     */
    select?: ZutatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Zutat
     */
    omit?: ZutatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZutatInclude<ExtArgs> | null
    /**
     * Filter, which Zutat to fetch.
     */
    where: ZutatWhereUniqueInput
  }

  /**
   * Zutat findFirst
   */
  export type ZutatFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Zutat
     */
    select?: ZutatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Zutat
     */
    omit?: ZutatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZutatInclude<ExtArgs> | null
    /**
     * Filter, which Zutat to fetch.
     */
    where?: ZutatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Zutats to fetch.
     */
    orderBy?: ZutatOrderByWithRelationInput | ZutatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Zutats.
     */
    cursor?: ZutatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Zutats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Zutats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Zutats.
     */
    distinct?: ZutatScalarFieldEnum | ZutatScalarFieldEnum[]
  }

  /**
   * Zutat findFirstOrThrow
   */
  export type ZutatFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Zutat
     */
    select?: ZutatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Zutat
     */
    omit?: ZutatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZutatInclude<ExtArgs> | null
    /**
     * Filter, which Zutat to fetch.
     */
    where?: ZutatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Zutats to fetch.
     */
    orderBy?: ZutatOrderByWithRelationInput | ZutatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Zutats.
     */
    cursor?: ZutatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Zutats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Zutats.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Zutats.
     */
    distinct?: ZutatScalarFieldEnum | ZutatScalarFieldEnum[]
  }

  /**
   * Zutat findMany
   */
  export type ZutatFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Zutat
     */
    select?: ZutatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Zutat
     */
    omit?: ZutatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZutatInclude<ExtArgs> | null
    /**
     * Filter, which Zutats to fetch.
     */
    where?: ZutatWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Zutats to fetch.
     */
    orderBy?: ZutatOrderByWithRelationInput | ZutatOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Zutats.
     */
    cursor?: ZutatWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Zutats from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Zutats.
     */
    skip?: number
    distinct?: ZutatScalarFieldEnum | ZutatScalarFieldEnum[]
  }

  /**
   * Zutat create
   */
  export type ZutatCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Zutat
     */
    select?: ZutatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Zutat
     */
    omit?: ZutatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZutatInclude<ExtArgs> | null
    /**
     * The data needed to create a Zutat.
     */
    data: XOR<ZutatCreateInput, ZutatUncheckedCreateInput>
  }

  /**
   * Zutat createMany
   */
  export type ZutatCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Zutats.
     */
    data: ZutatCreateManyInput | ZutatCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Zutat update
   */
  export type ZutatUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Zutat
     */
    select?: ZutatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Zutat
     */
    omit?: ZutatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZutatInclude<ExtArgs> | null
    /**
     * The data needed to update a Zutat.
     */
    data: XOR<ZutatUpdateInput, ZutatUncheckedUpdateInput>
    /**
     * Choose, which Zutat to update.
     */
    where: ZutatWhereUniqueInput
  }

  /**
   * Zutat updateMany
   */
  export type ZutatUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Zutats.
     */
    data: XOR<ZutatUpdateManyMutationInput, ZutatUncheckedUpdateManyInput>
    /**
     * Filter which Zutats to update
     */
    where?: ZutatWhereInput
    /**
     * Limit how many Zutats to update.
     */
    limit?: number
  }

  /**
   * Zutat upsert
   */
  export type ZutatUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Zutat
     */
    select?: ZutatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Zutat
     */
    omit?: ZutatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZutatInclude<ExtArgs> | null
    /**
     * The filter to search for the Zutat to update in case it exists.
     */
    where: ZutatWhereUniqueInput
    /**
     * In case the Zutat found by the `where` argument doesn't exist, create a new Zutat with this data.
     */
    create: XOR<ZutatCreateInput, ZutatUncheckedCreateInput>
    /**
     * In case the Zutat was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ZutatUpdateInput, ZutatUncheckedUpdateInput>
  }

  /**
   * Zutat delete
   */
  export type ZutatDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Zutat
     */
    select?: ZutatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Zutat
     */
    omit?: ZutatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZutatInclude<ExtArgs> | null
    /**
     * Filter which Zutat to delete.
     */
    where: ZutatWhereUniqueInput
  }

  /**
   * Zutat deleteMany
   */
  export type ZutatDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Zutats to delete
     */
    where?: ZutatWhereInput
    /**
     * Limit how many Zutats to delete.
     */
    limit?: number
  }

  /**
   * Zutat.gerichte
   */
  export type Zutat$gerichteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Gericht
     */
    select?: GerichtSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Gericht
     */
    omit?: GerichtOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GerichtInclude<ExtArgs> | null
    where?: GerichtWhereInput
    orderBy?: GerichtOrderByWithRelationInput | GerichtOrderByWithRelationInput[]
    cursor?: GerichtWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GerichtScalarFieldEnum | GerichtScalarFieldEnum[]
  }

  /**
   * Zutat without action
   */
  export type ZutatDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Zutat
     */
    select?: ZutatSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Zutat
     */
    omit?: ZutatOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ZutatInclude<ExtArgs> | null
  }


  /**
   * Model Bewertung
   */

  export type AggregateBewertung = {
    _count: BewertungCountAggregateOutputType | null
    _avg: BewertungAvgAggregateOutputType | null
    _sum: BewertungSumAggregateOutputType | null
    _min: BewertungMinAggregateOutputType | null
    _max: BewertungMaxAggregateOutputType | null
  }

  export type BewertungAvgAggregateOutputType = {
    id: number | null
    gerichtId: number | null
    bewertung: number | null
  }

  export type BewertungSumAggregateOutputType = {
    id: number | null
    gerichtId: number | null
    bewertung: number | null
  }

  export type BewertungMinAggregateOutputType = {
    id: number | null
    gerichtId: number | null
    bewertung: number | null
    kommentar: string | null
    erstelltAm: Date | null
    aktualisiertAm: Date | null
  }

  export type BewertungMaxAggregateOutputType = {
    id: number | null
    gerichtId: number | null
    bewertung: number | null
    kommentar: string | null
    erstelltAm: Date | null
    aktualisiertAm: Date | null
  }

  export type BewertungCountAggregateOutputType = {
    id: number
    gerichtId: number
    bewertung: number
    kommentar: number
    erstelltAm: number
    aktualisiertAm: number
    _all: number
  }


  export type BewertungAvgAggregateInputType = {
    id?: true
    gerichtId?: true
    bewertung?: true
  }

  export type BewertungSumAggregateInputType = {
    id?: true
    gerichtId?: true
    bewertung?: true
  }

  export type BewertungMinAggregateInputType = {
    id?: true
    gerichtId?: true
    bewertung?: true
    kommentar?: true
    erstelltAm?: true
    aktualisiertAm?: true
  }

  export type BewertungMaxAggregateInputType = {
    id?: true
    gerichtId?: true
    bewertung?: true
    kommentar?: true
    erstelltAm?: true
    aktualisiertAm?: true
  }

  export type BewertungCountAggregateInputType = {
    id?: true
    gerichtId?: true
    bewertung?: true
    kommentar?: true
    erstelltAm?: true
    aktualisiertAm?: true
    _all?: true
  }

  export type BewertungAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bewertung to aggregate.
     */
    where?: BewertungWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bewertungs to fetch.
     */
    orderBy?: BewertungOrderByWithRelationInput | BewertungOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BewertungWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bewertungs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bewertungs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Bewertungs
    **/
    _count?: true | BewertungCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BewertungAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BewertungSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BewertungMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BewertungMaxAggregateInputType
  }

  export type GetBewertungAggregateType<T extends BewertungAggregateArgs> = {
        [P in keyof T & keyof AggregateBewertung]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBewertung[P]>
      : GetScalarType<T[P], AggregateBewertung[P]>
  }




  export type BewertungGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BewertungWhereInput
    orderBy?: BewertungOrderByWithAggregationInput | BewertungOrderByWithAggregationInput[]
    by: BewertungScalarFieldEnum[] | BewertungScalarFieldEnum
    having?: BewertungScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BewertungCountAggregateInputType | true
    _avg?: BewertungAvgAggregateInputType
    _sum?: BewertungSumAggregateInputType
    _min?: BewertungMinAggregateInputType
    _max?: BewertungMaxAggregateInputType
  }

  export type BewertungGroupByOutputType = {
    id: number
    gerichtId: number
    bewertung: number
    kommentar: string | null
    erstelltAm: Date
    aktualisiertAm: Date
    _count: BewertungCountAggregateOutputType | null
    _avg: BewertungAvgAggregateOutputType | null
    _sum: BewertungSumAggregateOutputType | null
    _min: BewertungMinAggregateOutputType | null
    _max: BewertungMaxAggregateOutputType | null
  }

  type GetBewertungGroupByPayload<T extends BewertungGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BewertungGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BewertungGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BewertungGroupByOutputType[P]>
            : GetScalarType<T[P], BewertungGroupByOutputType[P]>
        }
      >
    >


  export type BewertungSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gerichtId?: boolean
    bewertung?: boolean
    kommentar?: boolean
    erstelltAm?: boolean
    aktualisiertAm?: boolean
    gericht?: boolean | GerichtDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["bewertung"]>



  export type BewertungSelectScalar = {
    id?: boolean
    gerichtId?: boolean
    bewertung?: boolean
    kommentar?: boolean
    erstelltAm?: boolean
    aktualisiertAm?: boolean
  }

  export type BewertungOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "gerichtId" | "bewertung" | "kommentar" | "erstelltAm" | "aktualisiertAm", ExtArgs["result"]["bewertung"]>
  export type BewertungInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gericht?: boolean | GerichtDefaultArgs<ExtArgs>
  }

  export type $BewertungPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Bewertung"
    objects: {
      gericht: Prisma.$GerichtPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      gerichtId: number
      bewertung: number
      kommentar: string | null
      erstelltAm: Date
      aktualisiertAm: Date
    }, ExtArgs["result"]["bewertung"]>
    composites: {}
  }

  type BewertungGetPayload<S extends boolean | null | undefined | BewertungDefaultArgs> = $Result.GetResult<Prisma.$BewertungPayload, S>

  type BewertungCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BewertungFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BewertungCountAggregateInputType | true
    }

  export interface BewertungDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Bewertung'], meta: { name: 'Bewertung' } }
    /**
     * Find zero or one Bewertung that matches the filter.
     * @param {BewertungFindUniqueArgs} args - Arguments to find a Bewertung
     * @example
     * // Get one Bewertung
     * const bewertung = await prisma.bewertung.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BewertungFindUniqueArgs>(args: SelectSubset<T, BewertungFindUniqueArgs<ExtArgs>>): Prisma__BewertungClient<$Result.GetResult<Prisma.$BewertungPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Bewertung that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BewertungFindUniqueOrThrowArgs} args - Arguments to find a Bewertung
     * @example
     * // Get one Bewertung
     * const bewertung = await prisma.bewertung.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BewertungFindUniqueOrThrowArgs>(args: SelectSubset<T, BewertungFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BewertungClient<$Result.GetResult<Prisma.$BewertungPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bewertung that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BewertungFindFirstArgs} args - Arguments to find a Bewertung
     * @example
     * // Get one Bewertung
     * const bewertung = await prisma.bewertung.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BewertungFindFirstArgs>(args?: SelectSubset<T, BewertungFindFirstArgs<ExtArgs>>): Prisma__BewertungClient<$Result.GetResult<Prisma.$BewertungPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Bewertung that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BewertungFindFirstOrThrowArgs} args - Arguments to find a Bewertung
     * @example
     * // Get one Bewertung
     * const bewertung = await prisma.bewertung.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BewertungFindFirstOrThrowArgs>(args?: SelectSubset<T, BewertungFindFirstOrThrowArgs<ExtArgs>>): Prisma__BewertungClient<$Result.GetResult<Prisma.$BewertungPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Bewertungs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BewertungFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Bewertungs
     * const bewertungs = await prisma.bewertung.findMany()
     * 
     * // Get first 10 Bewertungs
     * const bewertungs = await prisma.bewertung.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const bewertungWithIdOnly = await prisma.bewertung.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BewertungFindManyArgs>(args?: SelectSubset<T, BewertungFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BewertungPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Bewertung.
     * @param {BewertungCreateArgs} args - Arguments to create a Bewertung.
     * @example
     * // Create one Bewertung
     * const Bewertung = await prisma.bewertung.create({
     *   data: {
     *     // ... data to create a Bewertung
     *   }
     * })
     * 
     */
    create<T extends BewertungCreateArgs>(args: SelectSubset<T, BewertungCreateArgs<ExtArgs>>): Prisma__BewertungClient<$Result.GetResult<Prisma.$BewertungPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Bewertungs.
     * @param {BewertungCreateManyArgs} args - Arguments to create many Bewertungs.
     * @example
     * // Create many Bewertungs
     * const bewertung = await prisma.bewertung.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BewertungCreateManyArgs>(args?: SelectSubset<T, BewertungCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Bewertung.
     * @param {BewertungDeleteArgs} args - Arguments to delete one Bewertung.
     * @example
     * // Delete one Bewertung
     * const Bewertung = await prisma.bewertung.delete({
     *   where: {
     *     // ... filter to delete one Bewertung
     *   }
     * })
     * 
     */
    delete<T extends BewertungDeleteArgs>(args: SelectSubset<T, BewertungDeleteArgs<ExtArgs>>): Prisma__BewertungClient<$Result.GetResult<Prisma.$BewertungPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Bewertung.
     * @param {BewertungUpdateArgs} args - Arguments to update one Bewertung.
     * @example
     * // Update one Bewertung
     * const bewertung = await prisma.bewertung.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BewertungUpdateArgs>(args: SelectSubset<T, BewertungUpdateArgs<ExtArgs>>): Prisma__BewertungClient<$Result.GetResult<Prisma.$BewertungPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Bewertungs.
     * @param {BewertungDeleteManyArgs} args - Arguments to filter Bewertungs to delete.
     * @example
     * // Delete a few Bewertungs
     * const { count } = await prisma.bewertung.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BewertungDeleteManyArgs>(args?: SelectSubset<T, BewertungDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Bewertungs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BewertungUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Bewertungs
     * const bewertung = await prisma.bewertung.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BewertungUpdateManyArgs>(args: SelectSubset<T, BewertungUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Bewertung.
     * @param {BewertungUpsertArgs} args - Arguments to update or create a Bewertung.
     * @example
     * // Update or create a Bewertung
     * const bewertung = await prisma.bewertung.upsert({
     *   create: {
     *     // ... data to create a Bewertung
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Bewertung we want to update
     *   }
     * })
     */
    upsert<T extends BewertungUpsertArgs>(args: SelectSubset<T, BewertungUpsertArgs<ExtArgs>>): Prisma__BewertungClient<$Result.GetResult<Prisma.$BewertungPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Bewertungs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BewertungCountArgs} args - Arguments to filter Bewertungs to count.
     * @example
     * // Count the number of Bewertungs
     * const count = await prisma.bewertung.count({
     *   where: {
     *     // ... the filter for the Bewertungs we want to count
     *   }
     * })
    **/
    count<T extends BewertungCountArgs>(
      args?: Subset<T, BewertungCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BewertungCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Bewertung.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BewertungAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BewertungAggregateArgs>(args: Subset<T, BewertungAggregateArgs>): Prisma.PrismaPromise<GetBewertungAggregateType<T>>

    /**
     * Group by Bewertung.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BewertungGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BewertungGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BewertungGroupByArgs['orderBy'] }
        : { orderBy?: BewertungGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BewertungGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBewertungGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Bewertung model
   */
  readonly fields: BewertungFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Bewertung.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BewertungClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    gericht<T extends GerichtDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GerichtDefaultArgs<ExtArgs>>): Prisma__GerichtClient<$Result.GetResult<Prisma.$GerichtPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Bewertung model
   */
  interface BewertungFieldRefs {
    readonly id: FieldRef<"Bewertung", 'Int'>
    readonly gerichtId: FieldRef<"Bewertung", 'Int'>
    readonly bewertung: FieldRef<"Bewertung", 'Int'>
    readonly kommentar: FieldRef<"Bewertung", 'String'>
    readonly erstelltAm: FieldRef<"Bewertung", 'DateTime'>
    readonly aktualisiertAm: FieldRef<"Bewertung", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Bewertung findUnique
   */
  export type BewertungFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bewertung
     */
    select?: BewertungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bewertung
     */
    omit?: BewertungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BewertungInclude<ExtArgs> | null
    /**
     * Filter, which Bewertung to fetch.
     */
    where: BewertungWhereUniqueInput
  }

  /**
   * Bewertung findUniqueOrThrow
   */
  export type BewertungFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bewertung
     */
    select?: BewertungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bewertung
     */
    omit?: BewertungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BewertungInclude<ExtArgs> | null
    /**
     * Filter, which Bewertung to fetch.
     */
    where: BewertungWhereUniqueInput
  }

  /**
   * Bewertung findFirst
   */
  export type BewertungFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bewertung
     */
    select?: BewertungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bewertung
     */
    omit?: BewertungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BewertungInclude<ExtArgs> | null
    /**
     * Filter, which Bewertung to fetch.
     */
    where?: BewertungWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bewertungs to fetch.
     */
    orderBy?: BewertungOrderByWithRelationInput | BewertungOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bewertungs.
     */
    cursor?: BewertungWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bewertungs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bewertungs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bewertungs.
     */
    distinct?: BewertungScalarFieldEnum | BewertungScalarFieldEnum[]
  }

  /**
   * Bewertung findFirstOrThrow
   */
  export type BewertungFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bewertung
     */
    select?: BewertungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bewertung
     */
    omit?: BewertungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BewertungInclude<ExtArgs> | null
    /**
     * Filter, which Bewertung to fetch.
     */
    where?: BewertungWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bewertungs to fetch.
     */
    orderBy?: BewertungOrderByWithRelationInput | BewertungOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Bewertungs.
     */
    cursor?: BewertungWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bewertungs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bewertungs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Bewertungs.
     */
    distinct?: BewertungScalarFieldEnum | BewertungScalarFieldEnum[]
  }

  /**
   * Bewertung findMany
   */
  export type BewertungFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bewertung
     */
    select?: BewertungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bewertung
     */
    omit?: BewertungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BewertungInclude<ExtArgs> | null
    /**
     * Filter, which Bewertungs to fetch.
     */
    where?: BewertungWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Bewertungs to fetch.
     */
    orderBy?: BewertungOrderByWithRelationInput | BewertungOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Bewertungs.
     */
    cursor?: BewertungWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Bewertungs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Bewertungs.
     */
    skip?: number
    distinct?: BewertungScalarFieldEnum | BewertungScalarFieldEnum[]
  }

  /**
   * Bewertung create
   */
  export type BewertungCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bewertung
     */
    select?: BewertungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bewertung
     */
    omit?: BewertungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BewertungInclude<ExtArgs> | null
    /**
     * The data needed to create a Bewertung.
     */
    data: XOR<BewertungCreateInput, BewertungUncheckedCreateInput>
  }

  /**
   * Bewertung createMany
   */
  export type BewertungCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Bewertungs.
     */
    data: BewertungCreateManyInput | BewertungCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Bewertung update
   */
  export type BewertungUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bewertung
     */
    select?: BewertungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bewertung
     */
    omit?: BewertungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BewertungInclude<ExtArgs> | null
    /**
     * The data needed to update a Bewertung.
     */
    data: XOR<BewertungUpdateInput, BewertungUncheckedUpdateInput>
    /**
     * Choose, which Bewertung to update.
     */
    where: BewertungWhereUniqueInput
  }

  /**
   * Bewertung updateMany
   */
  export type BewertungUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Bewertungs.
     */
    data: XOR<BewertungUpdateManyMutationInput, BewertungUncheckedUpdateManyInput>
    /**
     * Filter which Bewertungs to update
     */
    where?: BewertungWhereInput
    /**
     * Limit how many Bewertungs to update.
     */
    limit?: number
  }

  /**
   * Bewertung upsert
   */
  export type BewertungUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bewertung
     */
    select?: BewertungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bewertung
     */
    omit?: BewertungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BewertungInclude<ExtArgs> | null
    /**
     * The filter to search for the Bewertung to update in case it exists.
     */
    where: BewertungWhereUniqueInput
    /**
     * In case the Bewertung found by the `where` argument doesn't exist, create a new Bewertung with this data.
     */
    create: XOR<BewertungCreateInput, BewertungUncheckedCreateInput>
    /**
     * In case the Bewertung was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BewertungUpdateInput, BewertungUncheckedUpdateInput>
  }

  /**
   * Bewertung delete
   */
  export type BewertungDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bewertung
     */
    select?: BewertungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bewertung
     */
    omit?: BewertungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BewertungInclude<ExtArgs> | null
    /**
     * Filter which Bewertung to delete.
     */
    where: BewertungWhereUniqueInput
  }

  /**
   * Bewertung deleteMany
   */
  export type BewertungDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Bewertungs to delete
     */
    where?: BewertungWhereInput
    /**
     * Limit how many Bewertungs to delete.
     */
    limit?: number
  }

  /**
   * Bewertung without action
   */
  export type BewertungDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Bewertung
     */
    select?: BewertungSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Bewertung
     */
    omit?: BewertungOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BewertungInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    passwordHash: 'passwordHash',
    sessionID: 'sessionID',
    role: 'role',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    timeIn: 'timeIn'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const RestaurantScalarFieldEnum: {
    id: 'id',
    name: 'name',
    parrentCompName: 'parrentCompName',
    parrentCompID: 'parrentCompID',
    menuId: 'menuId',
    memberSince: 'memberSince',
    locationID: 'locationID'
  };

  export type RestaurantScalarFieldEnum = (typeof RestaurantScalarFieldEnum)[keyof typeof RestaurantScalarFieldEnum]


  export const LocationScalarFieldEnum: {
    id: 'id',
    street: 'street',
    Hausnummer: 'Hausnummer',
    town: 'town',
    postcode: 'postcode',
    country: 'country',
    restaurantID: 'restaurantID'
  };

  export type LocationScalarFieldEnum = (typeof LocationScalarFieldEnum)[keyof typeof LocationScalarFieldEnum]


  export const ReservierungScalarFieldEnum: {
    id: 'id',
    locationID: 'locationID',
    restaurantID: 'restaurantID',
    phoneNum: 'phoneNum'
  };

  export type ReservierungScalarFieldEnum = (typeof ReservierungScalarFieldEnum)[keyof typeof ReservierungScalarFieldEnum]


  export const MenuScalarFieldEnum: {
    id: 'id',
    name: 'name',
    beschreibung: 'beschreibung',
    erstelltAm: 'erstelltAm',
    aktualisiertAm: 'aktualisiertAm',
    restaurantID: 'restaurantID'
  };

  export type MenuScalarFieldEnum = (typeof MenuScalarFieldEnum)[keyof typeof MenuScalarFieldEnum]


  export const KategorieScalarFieldEnum: {
    id: 'id',
    name: 'name',
    beschreibung: 'beschreibung',
    menuId: 'menuId'
  };

  export type KategorieScalarFieldEnum = (typeof KategorieScalarFieldEnum)[keyof typeof KategorieScalarFieldEnum]


  export const GerichtScalarFieldEnum: {
    id: 'id',
    name: 'name',
    beschreibung: 'beschreibung',
    preis: 'preis',
    kategorieId: 'kategorieId',
    erstelltAm: 'erstelltAm',
    aktualisiertAm: 'aktualisiertAm',
    img: 'img'
  };

  export type GerichtScalarFieldEnum = (typeof GerichtScalarFieldEnum)[keyof typeof GerichtScalarFieldEnum]


  export const ZutatScalarFieldEnum: {
    id: 'id',
    name: 'name',
    istAllergen: 'istAllergen'
  };

  export type ZutatScalarFieldEnum = (typeof ZutatScalarFieldEnum)[keyof typeof ZutatScalarFieldEnum]


  export const BewertungScalarFieldEnum: {
    id: 'id',
    gerichtId: 'gerichtId',
    bewertung: 'bewertung',
    kommentar: 'kommentar',
    erstelltAm: 'erstelltAm',
    aktualisiertAm: 'aktualisiertAm'
  };

  export type BewertungScalarFieldEnum = (typeof BewertungScalarFieldEnum)[keyof typeof BewertungScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const UserOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    passwordHash: 'passwordHash',
    sessionID: 'sessionID'
  };

  export type UserOrderByRelevanceFieldEnum = (typeof UserOrderByRelevanceFieldEnum)[keyof typeof UserOrderByRelevanceFieldEnum]


  export const SessionOrderByRelevanceFieldEnum: {
    id: 'id'
  };

  export type SessionOrderByRelevanceFieldEnum = (typeof SessionOrderByRelevanceFieldEnum)[keyof typeof SessionOrderByRelevanceFieldEnum]


  export const RestaurantOrderByRelevanceFieldEnum: {
    id: 'id',
    name: 'name',
    parrentCompName: 'parrentCompName',
    parrentCompID: 'parrentCompID',
    menuId: 'menuId',
    locationID: 'locationID'
  };

  export type RestaurantOrderByRelevanceFieldEnum = (typeof RestaurantOrderByRelevanceFieldEnum)[keyof typeof RestaurantOrderByRelevanceFieldEnum]


  export const LocationOrderByRelevanceFieldEnum: {
    id: 'id',
    street: 'street',
    Hausnummer: 'Hausnummer',
    town: 'town',
    postcode: 'postcode',
    country: 'country',
    restaurantID: 'restaurantID'
  };

  export type LocationOrderByRelevanceFieldEnum = (typeof LocationOrderByRelevanceFieldEnum)[keyof typeof LocationOrderByRelevanceFieldEnum]


  export const ReservierungOrderByRelevanceFieldEnum: {
    id: 'id',
    locationID: 'locationID',
    restaurantID: 'restaurantID',
    phoneNum: 'phoneNum'
  };

  export type ReservierungOrderByRelevanceFieldEnum = (typeof ReservierungOrderByRelevanceFieldEnum)[keyof typeof ReservierungOrderByRelevanceFieldEnum]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const MenuOrderByRelevanceFieldEnum: {
    name: 'name',
    beschreibung: 'beschreibung',
    restaurantID: 'restaurantID'
  };

  export type MenuOrderByRelevanceFieldEnum = (typeof MenuOrderByRelevanceFieldEnum)[keyof typeof MenuOrderByRelevanceFieldEnum]


  export const KategorieOrderByRelevanceFieldEnum: {
    name: 'name',
    beschreibung: 'beschreibung'
  };

  export type KategorieOrderByRelevanceFieldEnum = (typeof KategorieOrderByRelevanceFieldEnum)[keyof typeof KategorieOrderByRelevanceFieldEnum]


  export const GerichtOrderByRelevanceFieldEnum: {
    name: 'name',
    beschreibung: 'beschreibung',
    img: 'img'
  };

  export type GerichtOrderByRelevanceFieldEnum = (typeof GerichtOrderByRelevanceFieldEnum)[keyof typeof GerichtOrderByRelevanceFieldEnum]


  export const ZutatOrderByRelevanceFieldEnum: {
    name: 'name'
  };

  export type ZutatOrderByRelevanceFieldEnum = (typeof ZutatOrderByRelevanceFieldEnum)[keyof typeof ZutatOrderByRelevanceFieldEnum]


  export const BewertungOrderByRelevanceFieldEnum: {
    kommentar: 'kommentar'
  };

  export type BewertungOrderByRelevanceFieldEnum = (typeof BewertungOrderByRelevanceFieldEnum)[keyof typeof BewertungOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    sessionID?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    session?: XOR<SessionScalarRelationFilter, SessionWhereInput>
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    sessionID?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    session?: SessionOrderByWithRelationInput
    _relevance?: UserOrderByRelevanceInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    sessionID?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    session?: XOR<SessionScalarRelationFilter, SessionWhereInput>
  }, "id" | "name" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    sessionID?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    sessionID?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    timeIn?: DateTimeFilter<"Session"> | Date | string
    users?: UserListRelationFilter
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    timeIn?: SortOrder
    users?: UserOrderByRelationAggregateInput
    _relevance?: SessionOrderByRelevanceInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    timeIn?: DateTimeFilter<"Session"> | Date | string
    users?: UserListRelationFilter
  }, "id">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    timeIn?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    timeIn?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type RestaurantWhereInput = {
    AND?: RestaurantWhereInput | RestaurantWhereInput[]
    OR?: RestaurantWhereInput[]
    NOT?: RestaurantWhereInput | RestaurantWhereInput[]
    id?: StringFilter<"Restaurant"> | string
    name?: StringFilter<"Restaurant"> | string
    parrentCompName?: StringFilter<"Restaurant"> | string
    parrentCompID?: StringFilter<"Restaurant"> | string
    menuId?: StringFilter<"Restaurant"> | string
    memberSince?: DateTimeFilter<"Restaurant"> | Date | string
    locationID?: StringFilter<"Restaurant"> | string
    menu?: XOR<MenuNullableScalarRelationFilter, MenuWhereInput> | null
    location?: LocationListRelationFilter
    reservierung?: ReservierungListRelationFilter
  }

  export type RestaurantOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    parrentCompName?: SortOrder
    parrentCompID?: SortOrder
    menuId?: SortOrder
    memberSince?: SortOrder
    locationID?: SortOrder
    menu?: MenuOrderByWithRelationInput
    location?: LocationOrderByRelationAggregateInput
    reservierung?: ReservierungOrderByRelationAggregateInput
    _relevance?: RestaurantOrderByRelevanceInput
  }

  export type RestaurantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    menuId?: string
    locationID?: string
    AND?: RestaurantWhereInput | RestaurantWhereInput[]
    OR?: RestaurantWhereInput[]
    NOT?: RestaurantWhereInput | RestaurantWhereInput[]
    name?: StringFilter<"Restaurant"> | string
    parrentCompName?: StringFilter<"Restaurant"> | string
    parrentCompID?: StringFilter<"Restaurant"> | string
    memberSince?: DateTimeFilter<"Restaurant"> | Date | string
    menu?: XOR<MenuNullableScalarRelationFilter, MenuWhereInput> | null
    location?: LocationListRelationFilter
    reservierung?: ReservierungListRelationFilter
  }, "id" | "menuId" | "locationID">

  export type RestaurantOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    parrentCompName?: SortOrder
    parrentCompID?: SortOrder
    menuId?: SortOrder
    memberSince?: SortOrder
    locationID?: SortOrder
    _count?: RestaurantCountOrderByAggregateInput
    _max?: RestaurantMaxOrderByAggregateInput
    _min?: RestaurantMinOrderByAggregateInput
  }

  export type RestaurantScalarWhereWithAggregatesInput = {
    AND?: RestaurantScalarWhereWithAggregatesInput | RestaurantScalarWhereWithAggregatesInput[]
    OR?: RestaurantScalarWhereWithAggregatesInput[]
    NOT?: RestaurantScalarWhereWithAggregatesInput | RestaurantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Restaurant"> | string
    name?: StringWithAggregatesFilter<"Restaurant"> | string
    parrentCompName?: StringWithAggregatesFilter<"Restaurant"> | string
    parrentCompID?: StringWithAggregatesFilter<"Restaurant"> | string
    menuId?: StringWithAggregatesFilter<"Restaurant"> | string
    memberSince?: DateTimeWithAggregatesFilter<"Restaurant"> | Date | string
    locationID?: StringWithAggregatesFilter<"Restaurant"> | string
  }

  export type LocationWhereInput = {
    AND?: LocationWhereInput | LocationWhereInput[]
    OR?: LocationWhereInput[]
    NOT?: LocationWhereInput | LocationWhereInput[]
    id?: StringFilter<"Location"> | string
    street?: StringFilter<"Location"> | string
    Hausnummer?: StringFilter<"Location"> | string
    town?: StringFilter<"Location"> | string
    postcode?: StringFilter<"Location"> | string
    country?: StringFilter<"Location"> | string
    restaurantID?: StringFilter<"Location"> | string
    restaurant?: XOR<RestaurantScalarRelationFilter, RestaurantWhereInput>
    reservierung?: XOR<ReservierungNullableScalarRelationFilter, ReservierungWhereInput> | null
  }

  export type LocationOrderByWithRelationInput = {
    id?: SortOrder
    street?: SortOrder
    Hausnummer?: SortOrder
    town?: SortOrder
    postcode?: SortOrder
    country?: SortOrder
    restaurantID?: SortOrder
    restaurant?: RestaurantOrderByWithRelationInput
    reservierung?: ReservierungOrderByWithRelationInput
    _relevance?: LocationOrderByRelevanceInput
  }

  export type LocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    restaurantID?: string
    AND?: LocationWhereInput | LocationWhereInput[]
    OR?: LocationWhereInput[]
    NOT?: LocationWhereInput | LocationWhereInput[]
    street?: StringFilter<"Location"> | string
    Hausnummer?: StringFilter<"Location"> | string
    town?: StringFilter<"Location"> | string
    postcode?: StringFilter<"Location"> | string
    country?: StringFilter<"Location"> | string
    restaurant?: XOR<RestaurantScalarRelationFilter, RestaurantWhereInput>
    reservierung?: XOR<ReservierungNullableScalarRelationFilter, ReservierungWhereInput> | null
  }, "id" | "restaurantID">

  export type LocationOrderByWithAggregationInput = {
    id?: SortOrder
    street?: SortOrder
    Hausnummer?: SortOrder
    town?: SortOrder
    postcode?: SortOrder
    country?: SortOrder
    restaurantID?: SortOrder
    _count?: LocationCountOrderByAggregateInput
    _max?: LocationMaxOrderByAggregateInput
    _min?: LocationMinOrderByAggregateInput
  }

  export type LocationScalarWhereWithAggregatesInput = {
    AND?: LocationScalarWhereWithAggregatesInput | LocationScalarWhereWithAggregatesInput[]
    OR?: LocationScalarWhereWithAggregatesInput[]
    NOT?: LocationScalarWhereWithAggregatesInput | LocationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Location"> | string
    street?: StringWithAggregatesFilter<"Location"> | string
    Hausnummer?: StringWithAggregatesFilter<"Location"> | string
    town?: StringWithAggregatesFilter<"Location"> | string
    postcode?: StringWithAggregatesFilter<"Location"> | string
    country?: StringWithAggregatesFilter<"Location"> | string
    restaurantID?: StringWithAggregatesFilter<"Location"> | string
  }

  export type ReservierungWhereInput = {
    AND?: ReservierungWhereInput | ReservierungWhereInput[]
    OR?: ReservierungWhereInput[]
    NOT?: ReservierungWhereInput | ReservierungWhereInput[]
    id?: StringFilter<"Reservierung"> | string
    locationID?: StringFilter<"Reservierung"> | string
    restaurantID?: StringFilter<"Reservierung"> | string
    phoneNum?: StringFilter<"Reservierung"> | string
    location?: XOR<LocationScalarRelationFilter, LocationWhereInput>
    restaurant?: XOR<RestaurantScalarRelationFilter, RestaurantWhereInput>
  }

  export type ReservierungOrderByWithRelationInput = {
    id?: SortOrder
    locationID?: SortOrder
    restaurantID?: SortOrder
    phoneNum?: SortOrder
    location?: LocationOrderByWithRelationInput
    restaurant?: RestaurantOrderByWithRelationInput
    _relevance?: ReservierungOrderByRelevanceInput
  }

  export type ReservierungWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    locationID?: string
    restaurantID?: string
    AND?: ReservierungWhereInput | ReservierungWhereInput[]
    OR?: ReservierungWhereInput[]
    NOT?: ReservierungWhereInput | ReservierungWhereInput[]
    phoneNum?: StringFilter<"Reservierung"> | string
    location?: XOR<LocationScalarRelationFilter, LocationWhereInput>
    restaurant?: XOR<RestaurantScalarRelationFilter, RestaurantWhereInput>
  }, "id" | "locationID" | "restaurantID">

  export type ReservierungOrderByWithAggregationInput = {
    id?: SortOrder
    locationID?: SortOrder
    restaurantID?: SortOrder
    phoneNum?: SortOrder
    _count?: ReservierungCountOrderByAggregateInput
    _max?: ReservierungMaxOrderByAggregateInput
    _min?: ReservierungMinOrderByAggregateInput
  }

  export type ReservierungScalarWhereWithAggregatesInput = {
    AND?: ReservierungScalarWhereWithAggregatesInput | ReservierungScalarWhereWithAggregatesInput[]
    OR?: ReservierungScalarWhereWithAggregatesInput[]
    NOT?: ReservierungScalarWhereWithAggregatesInput | ReservierungScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Reservierung"> | string
    locationID?: StringWithAggregatesFilter<"Reservierung"> | string
    restaurantID?: StringWithAggregatesFilter<"Reservierung"> | string
    phoneNum?: StringWithAggregatesFilter<"Reservierung"> | string
  }

  export type MenuWhereInput = {
    AND?: MenuWhereInput | MenuWhereInput[]
    OR?: MenuWhereInput[]
    NOT?: MenuWhereInput | MenuWhereInput[]
    id?: IntFilter<"Menu"> | number
    name?: StringFilter<"Menu"> | string
    beschreibung?: StringNullableFilter<"Menu"> | string | null
    erstelltAm?: DateTimeFilter<"Menu"> | Date | string
    aktualisiertAm?: DateTimeFilter<"Menu"> | Date | string
    restaurantID?: StringFilter<"Menu"> | string
    kategorien?: KategorieListRelationFilter
    restaurant?: XOR<RestaurantScalarRelationFilter, RestaurantWhereInput>
  }

  export type MenuOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    beschreibung?: SortOrderInput | SortOrder
    erstelltAm?: SortOrder
    aktualisiertAm?: SortOrder
    restaurantID?: SortOrder
    kategorien?: KategorieOrderByRelationAggregateInput
    restaurant?: RestaurantOrderByWithRelationInput
    _relevance?: MenuOrderByRelevanceInput
  }

  export type MenuWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    restaurantID?: string
    AND?: MenuWhereInput | MenuWhereInput[]
    OR?: MenuWhereInput[]
    NOT?: MenuWhereInput | MenuWhereInput[]
    name?: StringFilter<"Menu"> | string
    beschreibung?: StringNullableFilter<"Menu"> | string | null
    erstelltAm?: DateTimeFilter<"Menu"> | Date | string
    aktualisiertAm?: DateTimeFilter<"Menu"> | Date | string
    kategorien?: KategorieListRelationFilter
    restaurant?: XOR<RestaurantScalarRelationFilter, RestaurantWhereInput>
  }, "id" | "restaurantID">

  export type MenuOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    beschreibung?: SortOrderInput | SortOrder
    erstelltAm?: SortOrder
    aktualisiertAm?: SortOrder
    restaurantID?: SortOrder
    _count?: MenuCountOrderByAggregateInput
    _avg?: MenuAvgOrderByAggregateInput
    _max?: MenuMaxOrderByAggregateInput
    _min?: MenuMinOrderByAggregateInput
    _sum?: MenuSumOrderByAggregateInput
  }

  export type MenuScalarWhereWithAggregatesInput = {
    AND?: MenuScalarWhereWithAggregatesInput | MenuScalarWhereWithAggregatesInput[]
    OR?: MenuScalarWhereWithAggregatesInput[]
    NOT?: MenuScalarWhereWithAggregatesInput | MenuScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Menu"> | number
    name?: StringWithAggregatesFilter<"Menu"> | string
    beschreibung?: StringNullableWithAggregatesFilter<"Menu"> | string | null
    erstelltAm?: DateTimeWithAggregatesFilter<"Menu"> | Date | string
    aktualisiertAm?: DateTimeWithAggregatesFilter<"Menu"> | Date | string
    restaurantID?: StringWithAggregatesFilter<"Menu"> | string
  }

  export type KategorieWhereInput = {
    AND?: KategorieWhereInput | KategorieWhereInput[]
    OR?: KategorieWhereInput[]
    NOT?: KategorieWhereInput | KategorieWhereInput[]
    id?: IntFilter<"Kategorie"> | number
    name?: StringFilter<"Kategorie"> | string
    beschreibung?: StringNullableFilter<"Kategorie"> | string | null
    menuId?: IntFilter<"Kategorie"> | number
    menu?: XOR<MenuScalarRelationFilter, MenuWhereInput>
    gerichte?: GerichtListRelationFilter
  }

  export type KategorieOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    beschreibung?: SortOrderInput | SortOrder
    menuId?: SortOrder
    menu?: MenuOrderByWithRelationInput
    gerichte?: GerichtOrderByRelationAggregateInput
    _relevance?: KategorieOrderByRelevanceInput
  }

  export type KategorieWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: KategorieWhereInput | KategorieWhereInput[]
    OR?: KategorieWhereInput[]
    NOT?: KategorieWhereInput | KategorieWhereInput[]
    name?: StringFilter<"Kategorie"> | string
    beschreibung?: StringNullableFilter<"Kategorie"> | string | null
    menuId?: IntFilter<"Kategorie"> | number
    menu?: XOR<MenuScalarRelationFilter, MenuWhereInput>
    gerichte?: GerichtListRelationFilter
  }, "id">

  export type KategorieOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    beschreibung?: SortOrderInput | SortOrder
    menuId?: SortOrder
    _count?: KategorieCountOrderByAggregateInput
    _avg?: KategorieAvgOrderByAggregateInput
    _max?: KategorieMaxOrderByAggregateInput
    _min?: KategorieMinOrderByAggregateInput
    _sum?: KategorieSumOrderByAggregateInput
  }

  export type KategorieScalarWhereWithAggregatesInput = {
    AND?: KategorieScalarWhereWithAggregatesInput | KategorieScalarWhereWithAggregatesInput[]
    OR?: KategorieScalarWhereWithAggregatesInput[]
    NOT?: KategorieScalarWhereWithAggregatesInput | KategorieScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Kategorie"> | number
    name?: StringWithAggregatesFilter<"Kategorie"> | string
    beschreibung?: StringNullableWithAggregatesFilter<"Kategorie"> | string | null
    menuId?: IntWithAggregatesFilter<"Kategorie"> | number
  }

  export type GerichtWhereInput = {
    AND?: GerichtWhereInput | GerichtWhereInput[]
    OR?: GerichtWhereInput[]
    NOT?: GerichtWhereInput | GerichtWhereInput[]
    id?: IntFilter<"Gericht"> | number
    name?: StringFilter<"Gericht"> | string
    beschreibung?: StringNullableFilter<"Gericht"> | string | null
    preis?: FloatFilter<"Gericht"> | number
    kategorieId?: IntFilter<"Gericht"> | number
    erstelltAm?: DateTimeFilter<"Gericht"> | Date | string
    aktualisiertAm?: DateTimeFilter<"Gericht"> | Date | string
    img?: StringFilter<"Gericht"> | string
    kategorie?: XOR<KategorieScalarRelationFilter, KategorieWhereInput>
    zutaten?: ZutatListRelationFilter
    Bewertung?: BewertungListRelationFilter
  }

  export type GerichtOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    beschreibung?: SortOrderInput | SortOrder
    preis?: SortOrder
    kategorieId?: SortOrder
    erstelltAm?: SortOrder
    aktualisiertAm?: SortOrder
    img?: SortOrder
    kategorie?: KategorieOrderByWithRelationInput
    zutaten?: ZutatOrderByRelationAggregateInput
    Bewertung?: BewertungOrderByRelationAggregateInput
    _relevance?: GerichtOrderByRelevanceInput
  }

  export type GerichtWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: GerichtWhereInput | GerichtWhereInput[]
    OR?: GerichtWhereInput[]
    NOT?: GerichtWhereInput | GerichtWhereInput[]
    name?: StringFilter<"Gericht"> | string
    beschreibung?: StringNullableFilter<"Gericht"> | string | null
    preis?: FloatFilter<"Gericht"> | number
    kategorieId?: IntFilter<"Gericht"> | number
    erstelltAm?: DateTimeFilter<"Gericht"> | Date | string
    aktualisiertAm?: DateTimeFilter<"Gericht"> | Date | string
    img?: StringFilter<"Gericht"> | string
    kategorie?: XOR<KategorieScalarRelationFilter, KategorieWhereInput>
    zutaten?: ZutatListRelationFilter
    Bewertung?: BewertungListRelationFilter
  }, "id">

  export type GerichtOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    beschreibung?: SortOrderInput | SortOrder
    preis?: SortOrder
    kategorieId?: SortOrder
    erstelltAm?: SortOrder
    aktualisiertAm?: SortOrder
    img?: SortOrder
    _count?: GerichtCountOrderByAggregateInput
    _avg?: GerichtAvgOrderByAggregateInput
    _max?: GerichtMaxOrderByAggregateInput
    _min?: GerichtMinOrderByAggregateInput
    _sum?: GerichtSumOrderByAggregateInput
  }

  export type GerichtScalarWhereWithAggregatesInput = {
    AND?: GerichtScalarWhereWithAggregatesInput | GerichtScalarWhereWithAggregatesInput[]
    OR?: GerichtScalarWhereWithAggregatesInput[]
    NOT?: GerichtScalarWhereWithAggregatesInput | GerichtScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Gericht"> | number
    name?: StringWithAggregatesFilter<"Gericht"> | string
    beschreibung?: StringNullableWithAggregatesFilter<"Gericht"> | string | null
    preis?: FloatWithAggregatesFilter<"Gericht"> | number
    kategorieId?: IntWithAggregatesFilter<"Gericht"> | number
    erstelltAm?: DateTimeWithAggregatesFilter<"Gericht"> | Date | string
    aktualisiertAm?: DateTimeWithAggregatesFilter<"Gericht"> | Date | string
    img?: StringWithAggregatesFilter<"Gericht"> | string
  }

  export type ZutatWhereInput = {
    AND?: ZutatWhereInput | ZutatWhereInput[]
    OR?: ZutatWhereInput[]
    NOT?: ZutatWhereInput | ZutatWhereInput[]
    id?: IntFilter<"Zutat"> | number
    name?: StringFilter<"Zutat"> | string
    istAllergen?: BoolFilter<"Zutat"> | boolean
    gerichte?: GerichtListRelationFilter
  }

  export type ZutatOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    istAllergen?: SortOrder
    gerichte?: GerichtOrderByRelationAggregateInput
    _relevance?: ZutatOrderByRelevanceInput
  }

  export type ZutatWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ZutatWhereInput | ZutatWhereInput[]
    OR?: ZutatWhereInput[]
    NOT?: ZutatWhereInput | ZutatWhereInput[]
    name?: StringFilter<"Zutat"> | string
    istAllergen?: BoolFilter<"Zutat"> | boolean
    gerichte?: GerichtListRelationFilter
  }, "id">

  export type ZutatOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    istAllergen?: SortOrder
    _count?: ZutatCountOrderByAggregateInput
    _avg?: ZutatAvgOrderByAggregateInput
    _max?: ZutatMaxOrderByAggregateInput
    _min?: ZutatMinOrderByAggregateInput
    _sum?: ZutatSumOrderByAggregateInput
  }

  export type ZutatScalarWhereWithAggregatesInput = {
    AND?: ZutatScalarWhereWithAggregatesInput | ZutatScalarWhereWithAggregatesInput[]
    OR?: ZutatScalarWhereWithAggregatesInput[]
    NOT?: ZutatScalarWhereWithAggregatesInput | ZutatScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Zutat"> | number
    name?: StringWithAggregatesFilter<"Zutat"> | string
    istAllergen?: BoolWithAggregatesFilter<"Zutat"> | boolean
  }

  export type BewertungWhereInput = {
    AND?: BewertungWhereInput | BewertungWhereInput[]
    OR?: BewertungWhereInput[]
    NOT?: BewertungWhereInput | BewertungWhereInput[]
    id?: IntFilter<"Bewertung"> | number
    gerichtId?: IntFilter<"Bewertung"> | number
    bewertung?: IntFilter<"Bewertung"> | number
    kommentar?: StringNullableFilter<"Bewertung"> | string | null
    erstelltAm?: DateTimeFilter<"Bewertung"> | Date | string
    aktualisiertAm?: DateTimeFilter<"Bewertung"> | Date | string
    gericht?: XOR<GerichtScalarRelationFilter, GerichtWhereInput>
  }

  export type BewertungOrderByWithRelationInput = {
    id?: SortOrder
    gerichtId?: SortOrder
    bewertung?: SortOrder
    kommentar?: SortOrderInput | SortOrder
    erstelltAm?: SortOrder
    aktualisiertAm?: SortOrder
    gericht?: GerichtOrderByWithRelationInput
    _relevance?: BewertungOrderByRelevanceInput
  }

  export type BewertungWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: BewertungWhereInput | BewertungWhereInput[]
    OR?: BewertungWhereInput[]
    NOT?: BewertungWhereInput | BewertungWhereInput[]
    gerichtId?: IntFilter<"Bewertung"> | number
    bewertung?: IntFilter<"Bewertung"> | number
    kommentar?: StringNullableFilter<"Bewertung"> | string | null
    erstelltAm?: DateTimeFilter<"Bewertung"> | Date | string
    aktualisiertAm?: DateTimeFilter<"Bewertung"> | Date | string
    gericht?: XOR<GerichtScalarRelationFilter, GerichtWhereInput>
  }, "id">

  export type BewertungOrderByWithAggregationInput = {
    id?: SortOrder
    gerichtId?: SortOrder
    bewertung?: SortOrder
    kommentar?: SortOrderInput | SortOrder
    erstelltAm?: SortOrder
    aktualisiertAm?: SortOrder
    _count?: BewertungCountOrderByAggregateInput
    _avg?: BewertungAvgOrderByAggregateInput
    _max?: BewertungMaxOrderByAggregateInput
    _min?: BewertungMinOrderByAggregateInput
    _sum?: BewertungSumOrderByAggregateInput
  }

  export type BewertungScalarWhereWithAggregatesInput = {
    AND?: BewertungScalarWhereWithAggregatesInput | BewertungScalarWhereWithAggregatesInput[]
    OR?: BewertungScalarWhereWithAggregatesInput[]
    NOT?: BewertungScalarWhereWithAggregatesInput | BewertungScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Bewertung"> | number
    gerichtId?: IntWithAggregatesFilter<"Bewertung"> | number
    bewertung?: IntWithAggregatesFilter<"Bewertung"> | number
    kommentar?: StringNullableWithAggregatesFilter<"Bewertung"> | string | null
    erstelltAm?: DateTimeWithAggregatesFilter<"Bewertung"> | Date | string
    aktualisiertAm?: DateTimeWithAggregatesFilter<"Bewertung"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    createdAt?: Date | string
    session: SessionCreateNestedOneWithoutUsersInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    sessionID: string
    role: $Enums.Role
    createdAt?: Date | string
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: SessionUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    sessionID?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    sessionID: string
    role: $Enums.Role
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    sessionID?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateInput = {
    id?: string
    timeIn: Date | string
    users?: UserCreateNestedManyWithoutSessionInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    timeIn: Date | string
    users?: UserUncheckedCreateNestedManyWithoutSessionInput
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timeIn?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutSessionNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timeIn?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type SessionCreateManyInput = {
    id?: string
    timeIn: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    timeIn?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    timeIn?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RestaurantCreateInput = {
    id?: string
    name: string
    parrentCompName: string
    parrentCompID: string
    menuId: string
    memberSince?: Date | string
    locationID: string
    menu?: MenuCreateNestedOneWithoutRestaurantInput
    location?: LocationCreateNestedManyWithoutRestaurantInput
    reservierung?: ReservierungCreateNestedManyWithoutRestaurantInput
  }

  export type RestaurantUncheckedCreateInput = {
    id?: string
    name: string
    parrentCompName: string
    parrentCompID: string
    menuId: string
    memberSince?: Date | string
    locationID: string
    menu?: MenuUncheckedCreateNestedOneWithoutRestaurantInput
    location?: LocationUncheckedCreateNestedManyWithoutRestaurantInput
    reservierung?: ReservierungUncheckedCreateNestedManyWithoutRestaurantInput
  }

  export type RestaurantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    parrentCompName?: StringFieldUpdateOperationsInput | string
    parrentCompID?: StringFieldUpdateOperationsInput | string
    menuId?: StringFieldUpdateOperationsInput | string
    memberSince?: DateTimeFieldUpdateOperationsInput | Date | string
    locationID?: StringFieldUpdateOperationsInput | string
    menu?: MenuUpdateOneWithoutRestaurantNestedInput
    location?: LocationUpdateManyWithoutRestaurantNestedInput
    reservierung?: ReservierungUpdateManyWithoutRestaurantNestedInput
  }

  export type RestaurantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    parrentCompName?: StringFieldUpdateOperationsInput | string
    parrentCompID?: StringFieldUpdateOperationsInput | string
    menuId?: StringFieldUpdateOperationsInput | string
    memberSince?: DateTimeFieldUpdateOperationsInput | Date | string
    locationID?: StringFieldUpdateOperationsInput | string
    menu?: MenuUncheckedUpdateOneWithoutRestaurantNestedInput
    location?: LocationUncheckedUpdateManyWithoutRestaurantNestedInput
    reservierung?: ReservierungUncheckedUpdateManyWithoutRestaurantNestedInput
  }

  export type RestaurantCreateManyInput = {
    id?: string
    name: string
    parrentCompName: string
    parrentCompID: string
    menuId: string
    memberSince?: Date | string
    locationID: string
  }

  export type RestaurantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    parrentCompName?: StringFieldUpdateOperationsInput | string
    parrentCompID?: StringFieldUpdateOperationsInput | string
    menuId?: StringFieldUpdateOperationsInput | string
    memberSince?: DateTimeFieldUpdateOperationsInput | Date | string
    locationID?: StringFieldUpdateOperationsInput | string
  }

  export type RestaurantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    parrentCompName?: StringFieldUpdateOperationsInput | string
    parrentCompID?: StringFieldUpdateOperationsInput | string
    menuId?: StringFieldUpdateOperationsInput | string
    memberSince?: DateTimeFieldUpdateOperationsInput | Date | string
    locationID?: StringFieldUpdateOperationsInput | string
  }

  export type LocationCreateInput = {
    id?: string
    street: string
    Hausnummer: string
    town: string
    postcode: string
    country: string
    restaurant: RestaurantCreateNestedOneWithoutLocationInput
    reservierung?: ReservierungCreateNestedOneWithoutLocationInput
  }

  export type LocationUncheckedCreateInput = {
    id?: string
    street: string
    Hausnummer: string
    town: string
    postcode: string
    country: string
    restaurantID: string
    reservierung?: ReservierungUncheckedCreateNestedOneWithoutLocationInput
  }

  export type LocationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    street?: StringFieldUpdateOperationsInput | string
    Hausnummer?: StringFieldUpdateOperationsInput | string
    town?: StringFieldUpdateOperationsInput | string
    postcode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    restaurant?: RestaurantUpdateOneRequiredWithoutLocationNestedInput
    reservierung?: ReservierungUpdateOneWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    street?: StringFieldUpdateOperationsInput | string
    Hausnummer?: StringFieldUpdateOperationsInput | string
    town?: StringFieldUpdateOperationsInput | string
    postcode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    restaurantID?: StringFieldUpdateOperationsInput | string
    reservierung?: ReservierungUncheckedUpdateOneWithoutLocationNestedInput
  }

  export type LocationCreateManyInput = {
    id?: string
    street: string
    Hausnummer: string
    town: string
    postcode: string
    country: string
    restaurantID: string
  }

  export type LocationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    street?: StringFieldUpdateOperationsInput | string
    Hausnummer?: StringFieldUpdateOperationsInput | string
    town?: StringFieldUpdateOperationsInput | string
    postcode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
  }

  export type LocationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    street?: StringFieldUpdateOperationsInput | string
    Hausnummer?: StringFieldUpdateOperationsInput | string
    town?: StringFieldUpdateOperationsInput | string
    postcode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    restaurantID?: StringFieldUpdateOperationsInput | string
  }

  export type ReservierungCreateInput = {
    id?: string
    phoneNum: string
    location: LocationCreateNestedOneWithoutReservierungInput
    restaurant: RestaurantCreateNestedOneWithoutReservierungInput
  }

  export type ReservierungUncheckedCreateInput = {
    id?: string
    locationID: string
    restaurantID: string
    phoneNum: string
  }

  export type ReservierungUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNum?: StringFieldUpdateOperationsInput | string
    location?: LocationUpdateOneRequiredWithoutReservierungNestedInput
    restaurant?: RestaurantUpdateOneRequiredWithoutReservierungNestedInput
  }

  export type ReservierungUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    locationID?: StringFieldUpdateOperationsInput | string
    restaurantID?: StringFieldUpdateOperationsInput | string
    phoneNum?: StringFieldUpdateOperationsInput | string
  }

  export type ReservierungCreateManyInput = {
    id?: string
    locationID: string
    restaurantID: string
    phoneNum: string
  }

  export type ReservierungUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNum?: StringFieldUpdateOperationsInput | string
  }

  export type ReservierungUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    locationID?: StringFieldUpdateOperationsInput | string
    restaurantID?: StringFieldUpdateOperationsInput | string
    phoneNum?: StringFieldUpdateOperationsInput | string
  }

  export type MenuCreateInput = {
    name: string
    beschreibung?: string | null
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
    kategorien?: KategorieCreateNestedManyWithoutMenuInput
    restaurant: RestaurantCreateNestedOneWithoutMenuInput
  }

  export type MenuUncheckedCreateInput = {
    id?: number
    name: string
    beschreibung?: string | null
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
    restaurantID: string
    kategorien?: KategorieUncheckedCreateNestedManyWithoutMenuInput
  }

  export type MenuUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
    kategorien?: KategorieUpdateManyWithoutMenuNestedInput
    restaurant?: RestaurantUpdateOneRequiredWithoutMenuNestedInput
  }

  export type MenuUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
    restaurantID?: StringFieldUpdateOperationsInput | string
    kategorien?: KategorieUncheckedUpdateManyWithoutMenuNestedInput
  }

  export type MenuCreateManyInput = {
    id?: number
    name: string
    beschreibung?: string | null
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
    restaurantID: string
  }

  export type MenuUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MenuUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
    restaurantID?: StringFieldUpdateOperationsInput | string
  }

  export type KategorieCreateInput = {
    name: string
    beschreibung?: string | null
    menu: MenuCreateNestedOneWithoutKategorienInput
    gerichte?: GerichtCreateNestedManyWithoutKategorieInput
  }

  export type KategorieUncheckedCreateInput = {
    id?: number
    name: string
    beschreibung?: string | null
    menuId: number
    gerichte?: GerichtUncheckedCreateNestedManyWithoutKategorieInput
  }

  export type KategorieUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    menu?: MenuUpdateOneRequiredWithoutKategorienNestedInput
    gerichte?: GerichtUpdateManyWithoutKategorieNestedInput
  }

  export type KategorieUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    menuId?: IntFieldUpdateOperationsInput | number
    gerichte?: GerichtUncheckedUpdateManyWithoutKategorieNestedInput
  }

  export type KategorieCreateManyInput = {
    id?: number
    name: string
    beschreibung?: string | null
    menuId: number
  }

  export type KategorieUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type KategorieUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    menuId?: IntFieldUpdateOperationsInput | number
  }

  export type GerichtCreateInput = {
    name: string
    beschreibung?: string | null
    preis: number
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
    img: string
    kategorie: KategorieCreateNestedOneWithoutGerichteInput
    zutaten?: ZutatCreateNestedManyWithoutGerichteInput
    Bewertung?: BewertungCreateNestedManyWithoutGerichtInput
  }

  export type GerichtUncheckedCreateInput = {
    id?: number
    name: string
    beschreibung?: string | null
    preis: number
    kategorieId: number
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
    img: string
    zutaten?: ZutatUncheckedCreateNestedManyWithoutGerichteInput
    Bewertung?: BewertungUncheckedCreateNestedManyWithoutGerichtInput
  }

  export type GerichtUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    preis?: FloatFieldUpdateOperationsInput | number
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
    img?: StringFieldUpdateOperationsInput | string
    kategorie?: KategorieUpdateOneRequiredWithoutGerichteNestedInput
    zutaten?: ZutatUpdateManyWithoutGerichteNestedInput
    Bewertung?: BewertungUpdateManyWithoutGerichtNestedInput
  }

  export type GerichtUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    preis?: FloatFieldUpdateOperationsInput | number
    kategorieId?: IntFieldUpdateOperationsInput | number
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
    img?: StringFieldUpdateOperationsInput | string
    zutaten?: ZutatUncheckedUpdateManyWithoutGerichteNestedInput
    Bewertung?: BewertungUncheckedUpdateManyWithoutGerichtNestedInput
  }

  export type GerichtCreateManyInput = {
    id?: number
    name: string
    beschreibung?: string | null
    preis: number
    kategorieId: number
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
    img: string
  }

  export type GerichtUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    preis?: FloatFieldUpdateOperationsInput | number
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
    img?: StringFieldUpdateOperationsInput | string
  }

  export type GerichtUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    preis?: FloatFieldUpdateOperationsInput | number
    kategorieId?: IntFieldUpdateOperationsInput | number
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
    img?: StringFieldUpdateOperationsInput | string
  }

  export type ZutatCreateInput = {
    name: string
    istAllergen?: boolean
    gerichte?: GerichtCreateNestedManyWithoutZutatenInput
  }

  export type ZutatUncheckedCreateInput = {
    id?: number
    name: string
    istAllergen?: boolean
    gerichte?: GerichtUncheckedCreateNestedManyWithoutZutatenInput
  }

  export type ZutatUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    istAllergen?: BoolFieldUpdateOperationsInput | boolean
    gerichte?: GerichtUpdateManyWithoutZutatenNestedInput
  }

  export type ZutatUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    istAllergen?: BoolFieldUpdateOperationsInput | boolean
    gerichte?: GerichtUncheckedUpdateManyWithoutZutatenNestedInput
  }

  export type ZutatCreateManyInput = {
    id?: number
    name: string
    istAllergen?: boolean
  }

  export type ZutatUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    istAllergen?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ZutatUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    istAllergen?: BoolFieldUpdateOperationsInput | boolean
  }

  export type BewertungCreateInput = {
    bewertung?: number
    kommentar?: string | null
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
    gericht: GerichtCreateNestedOneWithoutBewertungInput
  }

  export type BewertungUncheckedCreateInput = {
    id?: number
    gerichtId: number
    bewertung?: number
    kommentar?: string | null
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
  }

  export type BewertungUpdateInput = {
    bewertung?: IntFieldUpdateOperationsInput | number
    kommentar?: NullableStringFieldUpdateOperationsInput | string | null
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
    gericht?: GerichtUpdateOneRequiredWithoutBewertungNestedInput
  }

  export type BewertungUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    gerichtId?: IntFieldUpdateOperationsInput | number
    bewertung?: IntFieldUpdateOperationsInput | number
    kommentar?: NullableStringFieldUpdateOperationsInput | string | null
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BewertungCreateManyInput = {
    id?: number
    gerichtId: number
    bewertung?: number
    kommentar?: string | null
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
  }

  export type BewertungUpdateManyMutationInput = {
    bewertung?: IntFieldUpdateOperationsInput | number
    kommentar?: NullableStringFieldUpdateOperationsInput | string | null
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BewertungUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    gerichtId?: IntFieldUpdateOperationsInput | number
    bewertung?: IntFieldUpdateOperationsInput | number
    kommentar?: NullableStringFieldUpdateOperationsInput | string | null
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SessionScalarRelationFilter = {
    is?: SessionWhereInput
    isNot?: SessionWhereInput
  }

  export type UserOrderByRelevanceInput = {
    fields: UserOrderByRelevanceFieldEnum | UserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    sessionID?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    sessionID?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    sessionID?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelevanceInput = {
    fields: SessionOrderByRelevanceFieldEnum | SessionOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    timeIn?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    timeIn?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    timeIn?: SortOrder
  }

  export type MenuNullableScalarRelationFilter = {
    is?: MenuWhereInput | null
    isNot?: MenuWhereInput | null
  }

  export type LocationListRelationFilter = {
    every?: LocationWhereInput
    some?: LocationWhereInput
    none?: LocationWhereInput
  }

  export type ReservierungListRelationFilter = {
    every?: ReservierungWhereInput
    some?: ReservierungWhereInput
    none?: ReservierungWhereInput
  }

  export type LocationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReservierungOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RestaurantOrderByRelevanceInput = {
    fields: RestaurantOrderByRelevanceFieldEnum | RestaurantOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type RestaurantCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    parrentCompName?: SortOrder
    parrentCompID?: SortOrder
    menuId?: SortOrder
    memberSince?: SortOrder
    locationID?: SortOrder
  }

  export type RestaurantMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    parrentCompName?: SortOrder
    parrentCompID?: SortOrder
    menuId?: SortOrder
    memberSince?: SortOrder
    locationID?: SortOrder
  }

  export type RestaurantMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    parrentCompName?: SortOrder
    parrentCompID?: SortOrder
    menuId?: SortOrder
    memberSince?: SortOrder
    locationID?: SortOrder
  }

  export type RestaurantScalarRelationFilter = {
    is?: RestaurantWhereInput
    isNot?: RestaurantWhereInput
  }

  export type ReservierungNullableScalarRelationFilter = {
    is?: ReservierungWhereInput | null
    isNot?: ReservierungWhereInput | null
  }

  export type LocationOrderByRelevanceInput = {
    fields: LocationOrderByRelevanceFieldEnum | LocationOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type LocationCountOrderByAggregateInput = {
    id?: SortOrder
    street?: SortOrder
    Hausnummer?: SortOrder
    town?: SortOrder
    postcode?: SortOrder
    country?: SortOrder
    restaurantID?: SortOrder
  }

  export type LocationMaxOrderByAggregateInput = {
    id?: SortOrder
    street?: SortOrder
    Hausnummer?: SortOrder
    town?: SortOrder
    postcode?: SortOrder
    country?: SortOrder
    restaurantID?: SortOrder
  }

  export type LocationMinOrderByAggregateInput = {
    id?: SortOrder
    street?: SortOrder
    Hausnummer?: SortOrder
    town?: SortOrder
    postcode?: SortOrder
    country?: SortOrder
    restaurantID?: SortOrder
  }

  export type LocationScalarRelationFilter = {
    is?: LocationWhereInput
    isNot?: LocationWhereInput
  }

  export type ReservierungOrderByRelevanceInput = {
    fields: ReservierungOrderByRelevanceFieldEnum | ReservierungOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ReservierungCountOrderByAggregateInput = {
    id?: SortOrder
    locationID?: SortOrder
    restaurantID?: SortOrder
    phoneNum?: SortOrder
  }

  export type ReservierungMaxOrderByAggregateInput = {
    id?: SortOrder
    locationID?: SortOrder
    restaurantID?: SortOrder
    phoneNum?: SortOrder
  }

  export type ReservierungMinOrderByAggregateInput = {
    id?: SortOrder
    locationID?: SortOrder
    restaurantID?: SortOrder
    phoneNum?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type KategorieListRelationFilter = {
    every?: KategorieWhereInput
    some?: KategorieWhereInput
    none?: KategorieWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type KategorieOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MenuOrderByRelevanceInput = {
    fields: MenuOrderByRelevanceFieldEnum | MenuOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type MenuCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    beschreibung?: SortOrder
    erstelltAm?: SortOrder
    aktualisiertAm?: SortOrder
    restaurantID?: SortOrder
  }

  export type MenuAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type MenuMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    beschreibung?: SortOrder
    erstelltAm?: SortOrder
    aktualisiertAm?: SortOrder
    restaurantID?: SortOrder
  }

  export type MenuMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    beschreibung?: SortOrder
    erstelltAm?: SortOrder
    aktualisiertAm?: SortOrder
    restaurantID?: SortOrder
  }

  export type MenuSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type MenuScalarRelationFilter = {
    is?: MenuWhereInput
    isNot?: MenuWhereInput
  }

  export type GerichtListRelationFilter = {
    every?: GerichtWhereInput
    some?: GerichtWhereInput
    none?: GerichtWhereInput
  }

  export type GerichtOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type KategorieOrderByRelevanceInput = {
    fields: KategorieOrderByRelevanceFieldEnum | KategorieOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type KategorieCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    beschreibung?: SortOrder
    menuId?: SortOrder
  }

  export type KategorieAvgOrderByAggregateInput = {
    id?: SortOrder
    menuId?: SortOrder
  }

  export type KategorieMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    beschreibung?: SortOrder
    menuId?: SortOrder
  }

  export type KategorieMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    beschreibung?: SortOrder
    menuId?: SortOrder
  }

  export type KategorieSumOrderByAggregateInput = {
    id?: SortOrder
    menuId?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type KategorieScalarRelationFilter = {
    is?: KategorieWhereInput
    isNot?: KategorieWhereInput
  }

  export type ZutatListRelationFilter = {
    every?: ZutatWhereInput
    some?: ZutatWhereInput
    none?: ZutatWhereInput
  }

  export type BewertungListRelationFilter = {
    every?: BewertungWhereInput
    some?: BewertungWhereInput
    none?: BewertungWhereInput
  }

  export type ZutatOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BewertungOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GerichtOrderByRelevanceInput = {
    fields: GerichtOrderByRelevanceFieldEnum | GerichtOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type GerichtCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    beschreibung?: SortOrder
    preis?: SortOrder
    kategorieId?: SortOrder
    erstelltAm?: SortOrder
    aktualisiertAm?: SortOrder
    img?: SortOrder
  }

  export type GerichtAvgOrderByAggregateInput = {
    id?: SortOrder
    preis?: SortOrder
    kategorieId?: SortOrder
  }

  export type GerichtMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    beschreibung?: SortOrder
    preis?: SortOrder
    kategorieId?: SortOrder
    erstelltAm?: SortOrder
    aktualisiertAm?: SortOrder
    img?: SortOrder
  }

  export type GerichtMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    beschreibung?: SortOrder
    preis?: SortOrder
    kategorieId?: SortOrder
    erstelltAm?: SortOrder
    aktualisiertAm?: SortOrder
    img?: SortOrder
  }

  export type GerichtSumOrderByAggregateInput = {
    id?: SortOrder
    preis?: SortOrder
    kategorieId?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ZutatOrderByRelevanceInput = {
    fields: ZutatOrderByRelevanceFieldEnum | ZutatOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ZutatCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    istAllergen?: SortOrder
  }

  export type ZutatAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ZutatMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    istAllergen?: SortOrder
  }

  export type ZutatMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    istAllergen?: SortOrder
  }

  export type ZutatSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type GerichtScalarRelationFilter = {
    is?: GerichtWhereInput
    isNot?: GerichtWhereInput
  }

  export type BewertungOrderByRelevanceInput = {
    fields: BewertungOrderByRelevanceFieldEnum | BewertungOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type BewertungCountOrderByAggregateInput = {
    id?: SortOrder
    gerichtId?: SortOrder
    bewertung?: SortOrder
    kommentar?: SortOrder
    erstelltAm?: SortOrder
    aktualisiertAm?: SortOrder
  }

  export type BewertungAvgOrderByAggregateInput = {
    id?: SortOrder
    gerichtId?: SortOrder
    bewertung?: SortOrder
  }

  export type BewertungMaxOrderByAggregateInput = {
    id?: SortOrder
    gerichtId?: SortOrder
    bewertung?: SortOrder
    kommentar?: SortOrder
    erstelltAm?: SortOrder
    aktualisiertAm?: SortOrder
  }

  export type BewertungMinOrderByAggregateInput = {
    id?: SortOrder
    gerichtId?: SortOrder
    bewertung?: SortOrder
    kommentar?: SortOrder
    erstelltAm?: SortOrder
    aktualisiertAm?: SortOrder
  }

  export type BewertungSumOrderByAggregateInput = {
    id?: SortOrder
    gerichtId?: SortOrder
    bewertung?: SortOrder
  }

  export type SessionCreateNestedOneWithoutUsersInput = {
    create?: XOR<SessionCreateWithoutUsersInput, SessionUncheckedCreateWithoutUsersInput>
    connectOrCreate?: SessionCreateOrConnectWithoutUsersInput
    connect?: SessionWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type SessionUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<SessionCreateWithoutUsersInput, SessionUncheckedCreateWithoutUsersInput>
    connectOrCreate?: SessionCreateOrConnectWithoutUsersInput
    upsert?: SessionUpsertWithoutUsersInput
    connect?: SessionWhereUniqueInput
    update?: XOR<XOR<SessionUpdateToOneWithWhereWithoutUsersInput, SessionUpdateWithoutUsersInput>, SessionUncheckedUpdateWithoutUsersInput>
  }

  export type UserCreateNestedManyWithoutSessionInput = {
    create?: XOR<UserCreateWithoutSessionInput, UserUncheckedCreateWithoutSessionInput> | UserCreateWithoutSessionInput[] | UserUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: UserCreateOrConnectWithoutSessionInput | UserCreateOrConnectWithoutSessionInput[]
    createMany?: UserCreateManySessionInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<UserCreateWithoutSessionInput, UserUncheckedCreateWithoutSessionInput> | UserCreateWithoutSessionInput[] | UserUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: UserCreateOrConnectWithoutSessionInput | UserCreateOrConnectWithoutSessionInput[]
    createMany?: UserCreateManySessionInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutSessionNestedInput = {
    create?: XOR<UserCreateWithoutSessionInput, UserUncheckedCreateWithoutSessionInput> | UserCreateWithoutSessionInput[] | UserUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: UserCreateOrConnectWithoutSessionInput | UserCreateOrConnectWithoutSessionInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutSessionInput | UserUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: UserCreateManySessionInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutSessionInput | UserUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: UserUpdateManyWithWhereWithoutSessionInput | UserUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<UserCreateWithoutSessionInput, UserUncheckedCreateWithoutSessionInput> | UserCreateWithoutSessionInput[] | UserUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: UserCreateOrConnectWithoutSessionInput | UserCreateOrConnectWithoutSessionInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutSessionInput | UserUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: UserCreateManySessionInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutSessionInput | UserUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: UserUpdateManyWithWhereWithoutSessionInput | UserUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type MenuCreateNestedOneWithoutRestaurantInput = {
    create?: XOR<MenuCreateWithoutRestaurantInput, MenuUncheckedCreateWithoutRestaurantInput>
    connectOrCreate?: MenuCreateOrConnectWithoutRestaurantInput
    connect?: MenuWhereUniqueInput
  }

  export type LocationCreateNestedManyWithoutRestaurantInput = {
    create?: XOR<LocationCreateWithoutRestaurantInput, LocationUncheckedCreateWithoutRestaurantInput> | LocationCreateWithoutRestaurantInput[] | LocationUncheckedCreateWithoutRestaurantInput[]
    connectOrCreate?: LocationCreateOrConnectWithoutRestaurantInput | LocationCreateOrConnectWithoutRestaurantInput[]
    createMany?: LocationCreateManyRestaurantInputEnvelope
    connect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
  }

  export type ReservierungCreateNestedManyWithoutRestaurantInput = {
    create?: XOR<ReservierungCreateWithoutRestaurantInput, ReservierungUncheckedCreateWithoutRestaurantInput> | ReservierungCreateWithoutRestaurantInput[] | ReservierungUncheckedCreateWithoutRestaurantInput[]
    connectOrCreate?: ReservierungCreateOrConnectWithoutRestaurantInput | ReservierungCreateOrConnectWithoutRestaurantInput[]
    createMany?: ReservierungCreateManyRestaurantInputEnvelope
    connect?: ReservierungWhereUniqueInput | ReservierungWhereUniqueInput[]
  }

  export type MenuUncheckedCreateNestedOneWithoutRestaurantInput = {
    create?: XOR<MenuCreateWithoutRestaurantInput, MenuUncheckedCreateWithoutRestaurantInput>
    connectOrCreate?: MenuCreateOrConnectWithoutRestaurantInput
    connect?: MenuWhereUniqueInput
  }

  export type LocationUncheckedCreateNestedManyWithoutRestaurantInput = {
    create?: XOR<LocationCreateWithoutRestaurantInput, LocationUncheckedCreateWithoutRestaurantInput> | LocationCreateWithoutRestaurantInput[] | LocationUncheckedCreateWithoutRestaurantInput[]
    connectOrCreate?: LocationCreateOrConnectWithoutRestaurantInput | LocationCreateOrConnectWithoutRestaurantInput[]
    createMany?: LocationCreateManyRestaurantInputEnvelope
    connect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
  }

  export type ReservierungUncheckedCreateNestedManyWithoutRestaurantInput = {
    create?: XOR<ReservierungCreateWithoutRestaurantInput, ReservierungUncheckedCreateWithoutRestaurantInput> | ReservierungCreateWithoutRestaurantInput[] | ReservierungUncheckedCreateWithoutRestaurantInput[]
    connectOrCreate?: ReservierungCreateOrConnectWithoutRestaurantInput | ReservierungCreateOrConnectWithoutRestaurantInput[]
    createMany?: ReservierungCreateManyRestaurantInputEnvelope
    connect?: ReservierungWhereUniqueInput | ReservierungWhereUniqueInput[]
  }

  export type MenuUpdateOneWithoutRestaurantNestedInput = {
    create?: XOR<MenuCreateWithoutRestaurantInput, MenuUncheckedCreateWithoutRestaurantInput>
    connectOrCreate?: MenuCreateOrConnectWithoutRestaurantInput
    upsert?: MenuUpsertWithoutRestaurantInput
    disconnect?: MenuWhereInput | boolean
    delete?: MenuWhereInput | boolean
    connect?: MenuWhereUniqueInput
    update?: XOR<XOR<MenuUpdateToOneWithWhereWithoutRestaurantInput, MenuUpdateWithoutRestaurantInput>, MenuUncheckedUpdateWithoutRestaurantInput>
  }

  export type LocationUpdateManyWithoutRestaurantNestedInput = {
    create?: XOR<LocationCreateWithoutRestaurantInput, LocationUncheckedCreateWithoutRestaurantInput> | LocationCreateWithoutRestaurantInput[] | LocationUncheckedCreateWithoutRestaurantInput[]
    connectOrCreate?: LocationCreateOrConnectWithoutRestaurantInput | LocationCreateOrConnectWithoutRestaurantInput[]
    upsert?: LocationUpsertWithWhereUniqueWithoutRestaurantInput | LocationUpsertWithWhereUniqueWithoutRestaurantInput[]
    createMany?: LocationCreateManyRestaurantInputEnvelope
    set?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    disconnect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    delete?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    connect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    update?: LocationUpdateWithWhereUniqueWithoutRestaurantInput | LocationUpdateWithWhereUniqueWithoutRestaurantInput[]
    updateMany?: LocationUpdateManyWithWhereWithoutRestaurantInput | LocationUpdateManyWithWhereWithoutRestaurantInput[]
    deleteMany?: LocationScalarWhereInput | LocationScalarWhereInput[]
  }

  export type ReservierungUpdateManyWithoutRestaurantNestedInput = {
    create?: XOR<ReservierungCreateWithoutRestaurantInput, ReservierungUncheckedCreateWithoutRestaurantInput> | ReservierungCreateWithoutRestaurantInput[] | ReservierungUncheckedCreateWithoutRestaurantInput[]
    connectOrCreate?: ReservierungCreateOrConnectWithoutRestaurantInput | ReservierungCreateOrConnectWithoutRestaurantInput[]
    upsert?: ReservierungUpsertWithWhereUniqueWithoutRestaurantInput | ReservierungUpsertWithWhereUniqueWithoutRestaurantInput[]
    createMany?: ReservierungCreateManyRestaurantInputEnvelope
    set?: ReservierungWhereUniqueInput | ReservierungWhereUniqueInput[]
    disconnect?: ReservierungWhereUniqueInput | ReservierungWhereUniqueInput[]
    delete?: ReservierungWhereUniqueInput | ReservierungWhereUniqueInput[]
    connect?: ReservierungWhereUniqueInput | ReservierungWhereUniqueInput[]
    update?: ReservierungUpdateWithWhereUniqueWithoutRestaurantInput | ReservierungUpdateWithWhereUniqueWithoutRestaurantInput[]
    updateMany?: ReservierungUpdateManyWithWhereWithoutRestaurantInput | ReservierungUpdateManyWithWhereWithoutRestaurantInput[]
    deleteMany?: ReservierungScalarWhereInput | ReservierungScalarWhereInput[]
  }

  export type MenuUncheckedUpdateOneWithoutRestaurantNestedInput = {
    create?: XOR<MenuCreateWithoutRestaurantInput, MenuUncheckedCreateWithoutRestaurantInput>
    connectOrCreate?: MenuCreateOrConnectWithoutRestaurantInput
    upsert?: MenuUpsertWithoutRestaurantInput
    disconnect?: MenuWhereInput | boolean
    delete?: MenuWhereInput | boolean
    connect?: MenuWhereUniqueInput
    update?: XOR<XOR<MenuUpdateToOneWithWhereWithoutRestaurantInput, MenuUpdateWithoutRestaurantInput>, MenuUncheckedUpdateWithoutRestaurantInput>
  }

  export type LocationUncheckedUpdateManyWithoutRestaurantNestedInput = {
    create?: XOR<LocationCreateWithoutRestaurantInput, LocationUncheckedCreateWithoutRestaurantInput> | LocationCreateWithoutRestaurantInput[] | LocationUncheckedCreateWithoutRestaurantInput[]
    connectOrCreate?: LocationCreateOrConnectWithoutRestaurantInput | LocationCreateOrConnectWithoutRestaurantInput[]
    upsert?: LocationUpsertWithWhereUniqueWithoutRestaurantInput | LocationUpsertWithWhereUniqueWithoutRestaurantInput[]
    createMany?: LocationCreateManyRestaurantInputEnvelope
    set?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    disconnect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    delete?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    connect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    update?: LocationUpdateWithWhereUniqueWithoutRestaurantInput | LocationUpdateWithWhereUniqueWithoutRestaurantInput[]
    updateMany?: LocationUpdateManyWithWhereWithoutRestaurantInput | LocationUpdateManyWithWhereWithoutRestaurantInput[]
    deleteMany?: LocationScalarWhereInput | LocationScalarWhereInput[]
  }

  export type ReservierungUncheckedUpdateManyWithoutRestaurantNestedInput = {
    create?: XOR<ReservierungCreateWithoutRestaurantInput, ReservierungUncheckedCreateWithoutRestaurantInput> | ReservierungCreateWithoutRestaurantInput[] | ReservierungUncheckedCreateWithoutRestaurantInput[]
    connectOrCreate?: ReservierungCreateOrConnectWithoutRestaurantInput | ReservierungCreateOrConnectWithoutRestaurantInput[]
    upsert?: ReservierungUpsertWithWhereUniqueWithoutRestaurantInput | ReservierungUpsertWithWhereUniqueWithoutRestaurantInput[]
    createMany?: ReservierungCreateManyRestaurantInputEnvelope
    set?: ReservierungWhereUniqueInput | ReservierungWhereUniqueInput[]
    disconnect?: ReservierungWhereUniqueInput | ReservierungWhereUniqueInput[]
    delete?: ReservierungWhereUniqueInput | ReservierungWhereUniqueInput[]
    connect?: ReservierungWhereUniqueInput | ReservierungWhereUniqueInput[]
    update?: ReservierungUpdateWithWhereUniqueWithoutRestaurantInput | ReservierungUpdateWithWhereUniqueWithoutRestaurantInput[]
    updateMany?: ReservierungUpdateManyWithWhereWithoutRestaurantInput | ReservierungUpdateManyWithWhereWithoutRestaurantInput[]
    deleteMany?: ReservierungScalarWhereInput | ReservierungScalarWhereInput[]
  }

  export type RestaurantCreateNestedOneWithoutLocationInput = {
    create?: XOR<RestaurantCreateWithoutLocationInput, RestaurantUncheckedCreateWithoutLocationInput>
    connectOrCreate?: RestaurantCreateOrConnectWithoutLocationInput
    connect?: RestaurantWhereUniqueInput
  }

  export type ReservierungCreateNestedOneWithoutLocationInput = {
    create?: XOR<ReservierungCreateWithoutLocationInput, ReservierungUncheckedCreateWithoutLocationInput>
    connectOrCreate?: ReservierungCreateOrConnectWithoutLocationInput
    connect?: ReservierungWhereUniqueInput
  }

  export type ReservierungUncheckedCreateNestedOneWithoutLocationInput = {
    create?: XOR<ReservierungCreateWithoutLocationInput, ReservierungUncheckedCreateWithoutLocationInput>
    connectOrCreate?: ReservierungCreateOrConnectWithoutLocationInput
    connect?: ReservierungWhereUniqueInput
  }

  export type RestaurantUpdateOneRequiredWithoutLocationNestedInput = {
    create?: XOR<RestaurantCreateWithoutLocationInput, RestaurantUncheckedCreateWithoutLocationInput>
    connectOrCreate?: RestaurantCreateOrConnectWithoutLocationInput
    upsert?: RestaurantUpsertWithoutLocationInput
    connect?: RestaurantWhereUniqueInput
    update?: XOR<XOR<RestaurantUpdateToOneWithWhereWithoutLocationInput, RestaurantUpdateWithoutLocationInput>, RestaurantUncheckedUpdateWithoutLocationInput>
  }

  export type ReservierungUpdateOneWithoutLocationNestedInput = {
    create?: XOR<ReservierungCreateWithoutLocationInput, ReservierungUncheckedCreateWithoutLocationInput>
    connectOrCreate?: ReservierungCreateOrConnectWithoutLocationInput
    upsert?: ReservierungUpsertWithoutLocationInput
    disconnect?: ReservierungWhereInput | boolean
    delete?: ReservierungWhereInput | boolean
    connect?: ReservierungWhereUniqueInput
    update?: XOR<XOR<ReservierungUpdateToOneWithWhereWithoutLocationInput, ReservierungUpdateWithoutLocationInput>, ReservierungUncheckedUpdateWithoutLocationInput>
  }

  export type ReservierungUncheckedUpdateOneWithoutLocationNestedInput = {
    create?: XOR<ReservierungCreateWithoutLocationInput, ReservierungUncheckedCreateWithoutLocationInput>
    connectOrCreate?: ReservierungCreateOrConnectWithoutLocationInput
    upsert?: ReservierungUpsertWithoutLocationInput
    disconnect?: ReservierungWhereInput | boolean
    delete?: ReservierungWhereInput | boolean
    connect?: ReservierungWhereUniqueInput
    update?: XOR<XOR<ReservierungUpdateToOneWithWhereWithoutLocationInput, ReservierungUpdateWithoutLocationInput>, ReservierungUncheckedUpdateWithoutLocationInput>
  }

  export type LocationCreateNestedOneWithoutReservierungInput = {
    create?: XOR<LocationCreateWithoutReservierungInput, LocationUncheckedCreateWithoutReservierungInput>
    connectOrCreate?: LocationCreateOrConnectWithoutReservierungInput
    connect?: LocationWhereUniqueInput
  }

  export type RestaurantCreateNestedOneWithoutReservierungInput = {
    create?: XOR<RestaurantCreateWithoutReservierungInput, RestaurantUncheckedCreateWithoutReservierungInput>
    connectOrCreate?: RestaurantCreateOrConnectWithoutReservierungInput
    connect?: RestaurantWhereUniqueInput
  }

  export type LocationUpdateOneRequiredWithoutReservierungNestedInput = {
    create?: XOR<LocationCreateWithoutReservierungInput, LocationUncheckedCreateWithoutReservierungInput>
    connectOrCreate?: LocationCreateOrConnectWithoutReservierungInput
    upsert?: LocationUpsertWithoutReservierungInput
    connect?: LocationWhereUniqueInput
    update?: XOR<XOR<LocationUpdateToOneWithWhereWithoutReservierungInput, LocationUpdateWithoutReservierungInput>, LocationUncheckedUpdateWithoutReservierungInput>
  }

  export type RestaurantUpdateOneRequiredWithoutReservierungNestedInput = {
    create?: XOR<RestaurantCreateWithoutReservierungInput, RestaurantUncheckedCreateWithoutReservierungInput>
    connectOrCreate?: RestaurantCreateOrConnectWithoutReservierungInput
    upsert?: RestaurantUpsertWithoutReservierungInput
    connect?: RestaurantWhereUniqueInput
    update?: XOR<XOR<RestaurantUpdateToOneWithWhereWithoutReservierungInput, RestaurantUpdateWithoutReservierungInput>, RestaurantUncheckedUpdateWithoutReservierungInput>
  }

  export type KategorieCreateNestedManyWithoutMenuInput = {
    create?: XOR<KategorieCreateWithoutMenuInput, KategorieUncheckedCreateWithoutMenuInput> | KategorieCreateWithoutMenuInput[] | KategorieUncheckedCreateWithoutMenuInput[]
    connectOrCreate?: KategorieCreateOrConnectWithoutMenuInput | KategorieCreateOrConnectWithoutMenuInput[]
    createMany?: KategorieCreateManyMenuInputEnvelope
    connect?: KategorieWhereUniqueInput | KategorieWhereUniqueInput[]
  }

  export type RestaurantCreateNestedOneWithoutMenuInput = {
    create?: XOR<RestaurantCreateWithoutMenuInput, RestaurantUncheckedCreateWithoutMenuInput>
    connectOrCreate?: RestaurantCreateOrConnectWithoutMenuInput
    connect?: RestaurantWhereUniqueInput
  }

  export type KategorieUncheckedCreateNestedManyWithoutMenuInput = {
    create?: XOR<KategorieCreateWithoutMenuInput, KategorieUncheckedCreateWithoutMenuInput> | KategorieCreateWithoutMenuInput[] | KategorieUncheckedCreateWithoutMenuInput[]
    connectOrCreate?: KategorieCreateOrConnectWithoutMenuInput | KategorieCreateOrConnectWithoutMenuInput[]
    createMany?: KategorieCreateManyMenuInputEnvelope
    connect?: KategorieWhereUniqueInput | KategorieWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type KategorieUpdateManyWithoutMenuNestedInput = {
    create?: XOR<KategorieCreateWithoutMenuInput, KategorieUncheckedCreateWithoutMenuInput> | KategorieCreateWithoutMenuInput[] | KategorieUncheckedCreateWithoutMenuInput[]
    connectOrCreate?: KategorieCreateOrConnectWithoutMenuInput | KategorieCreateOrConnectWithoutMenuInput[]
    upsert?: KategorieUpsertWithWhereUniqueWithoutMenuInput | KategorieUpsertWithWhereUniqueWithoutMenuInput[]
    createMany?: KategorieCreateManyMenuInputEnvelope
    set?: KategorieWhereUniqueInput | KategorieWhereUniqueInput[]
    disconnect?: KategorieWhereUniqueInput | KategorieWhereUniqueInput[]
    delete?: KategorieWhereUniqueInput | KategorieWhereUniqueInput[]
    connect?: KategorieWhereUniqueInput | KategorieWhereUniqueInput[]
    update?: KategorieUpdateWithWhereUniqueWithoutMenuInput | KategorieUpdateWithWhereUniqueWithoutMenuInput[]
    updateMany?: KategorieUpdateManyWithWhereWithoutMenuInput | KategorieUpdateManyWithWhereWithoutMenuInput[]
    deleteMany?: KategorieScalarWhereInput | KategorieScalarWhereInput[]
  }

  export type RestaurantUpdateOneRequiredWithoutMenuNestedInput = {
    create?: XOR<RestaurantCreateWithoutMenuInput, RestaurantUncheckedCreateWithoutMenuInput>
    connectOrCreate?: RestaurantCreateOrConnectWithoutMenuInput
    upsert?: RestaurantUpsertWithoutMenuInput
    connect?: RestaurantWhereUniqueInput
    update?: XOR<XOR<RestaurantUpdateToOneWithWhereWithoutMenuInput, RestaurantUpdateWithoutMenuInput>, RestaurantUncheckedUpdateWithoutMenuInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type KategorieUncheckedUpdateManyWithoutMenuNestedInput = {
    create?: XOR<KategorieCreateWithoutMenuInput, KategorieUncheckedCreateWithoutMenuInput> | KategorieCreateWithoutMenuInput[] | KategorieUncheckedCreateWithoutMenuInput[]
    connectOrCreate?: KategorieCreateOrConnectWithoutMenuInput | KategorieCreateOrConnectWithoutMenuInput[]
    upsert?: KategorieUpsertWithWhereUniqueWithoutMenuInput | KategorieUpsertWithWhereUniqueWithoutMenuInput[]
    createMany?: KategorieCreateManyMenuInputEnvelope
    set?: KategorieWhereUniqueInput | KategorieWhereUniqueInput[]
    disconnect?: KategorieWhereUniqueInput | KategorieWhereUniqueInput[]
    delete?: KategorieWhereUniqueInput | KategorieWhereUniqueInput[]
    connect?: KategorieWhereUniqueInput | KategorieWhereUniqueInput[]
    update?: KategorieUpdateWithWhereUniqueWithoutMenuInput | KategorieUpdateWithWhereUniqueWithoutMenuInput[]
    updateMany?: KategorieUpdateManyWithWhereWithoutMenuInput | KategorieUpdateManyWithWhereWithoutMenuInput[]
    deleteMany?: KategorieScalarWhereInput | KategorieScalarWhereInput[]
  }

  export type MenuCreateNestedOneWithoutKategorienInput = {
    create?: XOR<MenuCreateWithoutKategorienInput, MenuUncheckedCreateWithoutKategorienInput>
    connectOrCreate?: MenuCreateOrConnectWithoutKategorienInput
    connect?: MenuWhereUniqueInput
  }

  export type GerichtCreateNestedManyWithoutKategorieInput = {
    create?: XOR<GerichtCreateWithoutKategorieInput, GerichtUncheckedCreateWithoutKategorieInput> | GerichtCreateWithoutKategorieInput[] | GerichtUncheckedCreateWithoutKategorieInput[]
    connectOrCreate?: GerichtCreateOrConnectWithoutKategorieInput | GerichtCreateOrConnectWithoutKategorieInput[]
    createMany?: GerichtCreateManyKategorieInputEnvelope
    connect?: GerichtWhereUniqueInput | GerichtWhereUniqueInput[]
  }

  export type GerichtUncheckedCreateNestedManyWithoutKategorieInput = {
    create?: XOR<GerichtCreateWithoutKategorieInput, GerichtUncheckedCreateWithoutKategorieInput> | GerichtCreateWithoutKategorieInput[] | GerichtUncheckedCreateWithoutKategorieInput[]
    connectOrCreate?: GerichtCreateOrConnectWithoutKategorieInput | GerichtCreateOrConnectWithoutKategorieInput[]
    createMany?: GerichtCreateManyKategorieInputEnvelope
    connect?: GerichtWhereUniqueInput | GerichtWhereUniqueInput[]
  }

  export type MenuUpdateOneRequiredWithoutKategorienNestedInput = {
    create?: XOR<MenuCreateWithoutKategorienInput, MenuUncheckedCreateWithoutKategorienInput>
    connectOrCreate?: MenuCreateOrConnectWithoutKategorienInput
    upsert?: MenuUpsertWithoutKategorienInput
    connect?: MenuWhereUniqueInput
    update?: XOR<XOR<MenuUpdateToOneWithWhereWithoutKategorienInput, MenuUpdateWithoutKategorienInput>, MenuUncheckedUpdateWithoutKategorienInput>
  }

  export type GerichtUpdateManyWithoutKategorieNestedInput = {
    create?: XOR<GerichtCreateWithoutKategorieInput, GerichtUncheckedCreateWithoutKategorieInput> | GerichtCreateWithoutKategorieInput[] | GerichtUncheckedCreateWithoutKategorieInput[]
    connectOrCreate?: GerichtCreateOrConnectWithoutKategorieInput | GerichtCreateOrConnectWithoutKategorieInput[]
    upsert?: GerichtUpsertWithWhereUniqueWithoutKategorieInput | GerichtUpsertWithWhereUniqueWithoutKategorieInput[]
    createMany?: GerichtCreateManyKategorieInputEnvelope
    set?: GerichtWhereUniqueInput | GerichtWhereUniqueInput[]
    disconnect?: GerichtWhereUniqueInput | GerichtWhereUniqueInput[]
    delete?: GerichtWhereUniqueInput | GerichtWhereUniqueInput[]
    connect?: GerichtWhereUniqueInput | GerichtWhereUniqueInput[]
    update?: GerichtUpdateWithWhereUniqueWithoutKategorieInput | GerichtUpdateWithWhereUniqueWithoutKategorieInput[]
    updateMany?: GerichtUpdateManyWithWhereWithoutKategorieInput | GerichtUpdateManyWithWhereWithoutKategorieInput[]
    deleteMany?: GerichtScalarWhereInput | GerichtScalarWhereInput[]
  }

  export type GerichtUncheckedUpdateManyWithoutKategorieNestedInput = {
    create?: XOR<GerichtCreateWithoutKategorieInput, GerichtUncheckedCreateWithoutKategorieInput> | GerichtCreateWithoutKategorieInput[] | GerichtUncheckedCreateWithoutKategorieInput[]
    connectOrCreate?: GerichtCreateOrConnectWithoutKategorieInput | GerichtCreateOrConnectWithoutKategorieInput[]
    upsert?: GerichtUpsertWithWhereUniqueWithoutKategorieInput | GerichtUpsertWithWhereUniqueWithoutKategorieInput[]
    createMany?: GerichtCreateManyKategorieInputEnvelope
    set?: GerichtWhereUniqueInput | GerichtWhereUniqueInput[]
    disconnect?: GerichtWhereUniqueInput | GerichtWhereUniqueInput[]
    delete?: GerichtWhereUniqueInput | GerichtWhereUniqueInput[]
    connect?: GerichtWhereUniqueInput | GerichtWhereUniqueInput[]
    update?: GerichtUpdateWithWhereUniqueWithoutKategorieInput | GerichtUpdateWithWhereUniqueWithoutKategorieInput[]
    updateMany?: GerichtUpdateManyWithWhereWithoutKategorieInput | GerichtUpdateManyWithWhereWithoutKategorieInput[]
    deleteMany?: GerichtScalarWhereInput | GerichtScalarWhereInput[]
  }

  export type KategorieCreateNestedOneWithoutGerichteInput = {
    create?: XOR<KategorieCreateWithoutGerichteInput, KategorieUncheckedCreateWithoutGerichteInput>
    connectOrCreate?: KategorieCreateOrConnectWithoutGerichteInput
    connect?: KategorieWhereUniqueInput
  }

  export type ZutatCreateNestedManyWithoutGerichteInput = {
    create?: XOR<ZutatCreateWithoutGerichteInput, ZutatUncheckedCreateWithoutGerichteInput> | ZutatCreateWithoutGerichteInput[] | ZutatUncheckedCreateWithoutGerichteInput[]
    connectOrCreate?: ZutatCreateOrConnectWithoutGerichteInput | ZutatCreateOrConnectWithoutGerichteInput[]
    connect?: ZutatWhereUniqueInput | ZutatWhereUniqueInput[]
  }

  export type BewertungCreateNestedManyWithoutGerichtInput = {
    create?: XOR<BewertungCreateWithoutGerichtInput, BewertungUncheckedCreateWithoutGerichtInput> | BewertungCreateWithoutGerichtInput[] | BewertungUncheckedCreateWithoutGerichtInput[]
    connectOrCreate?: BewertungCreateOrConnectWithoutGerichtInput | BewertungCreateOrConnectWithoutGerichtInput[]
    createMany?: BewertungCreateManyGerichtInputEnvelope
    connect?: BewertungWhereUniqueInput | BewertungWhereUniqueInput[]
  }

  export type ZutatUncheckedCreateNestedManyWithoutGerichteInput = {
    create?: XOR<ZutatCreateWithoutGerichteInput, ZutatUncheckedCreateWithoutGerichteInput> | ZutatCreateWithoutGerichteInput[] | ZutatUncheckedCreateWithoutGerichteInput[]
    connectOrCreate?: ZutatCreateOrConnectWithoutGerichteInput | ZutatCreateOrConnectWithoutGerichteInput[]
    connect?: ZutatWhereUniqueInput | ZutatWhereUniqueInput[]
  }

  export type BewertungUncheckedCreateNestedManyWithoutGerichtInput = {
    create?: XOR<BewertungCreateWithoutGerichtInput, BewertungUncheckedCreateWithoutGerichtInput> | BewertungCreateWithoutGerichtInput[] | BewertungUncheckedCreateWithoutGerichtInput[]
    connectOrCreate?: BewertungCreateOrConnectWithoutGerichtInput | BewertungCreateOrConnectWithoutGerichtInput[]
    createMany?: BewertungCreateManyGerichtInputEnvelope
    connect?: BewertungWhereUniqueInput | BewertungWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type KategorieUpdateOneRequiredWithoutGerichteNestedInput = {
    create?: XOR<KategorieCreateWithoutGerichteInput, KategorieUncheckedCreateWithoutGerichteInput>
    connectOrCreate?: KategorieCreateOrConnectWithoutGerichteInput
    upsert?: KategorieUpsertWithoutGerichteInput
    connect?: KategorieWhereUniqueInput
    update?: XOR<XOR<KategorieUpdateToOneWithWhereWithoutGerichteInput, KategorieUpdateWithoutGerichteInput>, KategorieUncheckedUpdateWithoutGerichteInput>
  }

  export type ZutatUpdateManyWithoutGerichteNestedInput = {
    create?: XOR<ZutatCreateWithoutGerichteInput, ZutatUncheckedCreateWithoutGerichteInput> | ZutatCreateWithoutGerichteInput[] | ZutatUncheckedCreateWithoutGerichteInput[]
    connectOrCreate?: ZutatCreateOrConnectWithoutGerichteInput | ZutatCreateOrConnectWithoutGerichteInput[]
    upsert?: ZutatUpsertWithWhereUniqueWithoutGerichteInput | ZutatUpsertWithWhereUniqueWithoutGerichteInput[]
    set?: ZutatWhereUniqueInput | ZutatWhereUniqueInput[]
    disconnect?: ZutatWhereUniqueInput | ZutatWhereUniqueInput[]
    delete?: ZutatWhereUniqueInput | ZutatWhereUniqueInput[]
    connect?: ZutatWhereUniqueInput | ZutatWhereUniqueInput[]
    update?: ZutatUpdateWithWhereUniqueWithoutGerichteInput | ZutatUpdateWithWhereUniqueWithoutGerichteInput[]
    updateMany?: ZutatUpdateManyWithWhereWithoutGerichteInput | ZutatUpdateManyWithWhereWithoutGerichteInput[]
    deleteMany?: ZutatScalarWhereInput | ZutatScalarWhereInput[]
  }

  export type BewertungUpdateManyWithoutGerichtNestedInput = {
    create?: XOR<BewertungCreateWithoutGerichtInput, BewertungUncheckedCreateWithoutGerichtInput> | BewertungCreateWithoutGerichtInput[] | BewertungUncheckedCreateWithoutGerichtInput[]
    connectOrCreate?: BewertungCreateOrConnectWithoutGerichtInput | BewertungCreateOrConnectWithoutGerichtInput[]
    upsert?: BewertungUpsertWithWhereUniqueWithoutGerichtInput | BewertungUpsertWithWhereUniqueWithoutGerichtInput[]
    createMany?: BewertungCreateManyGerichtInputEnvelope
    set?: BewertungWhereUniqueInput | BewertungWhereUniqueInput[]
    disconnect?: BewertungWhereUniqueInput | BewertungWhereUniqueInput[]
    delete?: BewertungWhereUniqueInput | BewertungWhereUniqueInput[]
    connect?: BewertungWhereUniqueInput | BewertungWhereUniqueInput[]
    update?: BewertungUpdateWithWhereUniqueWithoutGerichtInput | BewertungUpdateWithWhereUniqueWithoutGerichtInput[]
    updateMany?: BewertungUpdateManyWithWhereWithoutGerichtInput | BewertungUpdateManyWithWhereWithoutGerichtInput[]
    deleteMany?: BewertungScalarWhereInput | BewertungScalarWhereInput[]
  }

  export type ZutatUncheckedUpdateManyWithoutGerichteNestedInput = {
    create?: XOR<ZutatCreateWithoutGerichteInput, ZutatUncheckedCreateWithoutGerichteInput> | ZutatCreateWithoutGerichteInput[] | ZutatUncheckedCreateWithoutGerichteInput[]
    connectOrCreate?: ZutatCreateOrConnectWithoutGerichteInput | ZutatCreateOrConnectWithoutGerichteInput[]
    upsert?: ZutatUpsertWithWhereUniqueWithoutGerichteInput | ZutatUpsertWithWhereUniqueWithoutGerichteInput[]
    set?: ZutatWhereUniqueInput | ZutatWhereUniqueInput[]
    disconnect?: ZutatWhereUniqueInput | ZutatWhereUniqueInput[]
    delete?: ZutatWhereUniqueInput | ZutatWhereUniqueInput[]
    connect?: ZutatWhereUniqueInput | ZutatWhereUniqueInput[]
    update?: ZutatUpdateWithWhereUniqueWithoutGerichteInput | ZutatUpdateWithWhereUniqueWithoutGerichteInput[]
    updateMany?: ZutatUpdateManyWithWhereWithoutGerichteInput | ZutatUpdateManyWithWhereWithoutGerichteInput[]
    deleteMany?: ZutatScalarWhereInput | ZutatScalarWhereInput[]
  }

  export type BewertungUncheckedUpdateManyWithoutGerichtNestedInput = {
    create?: XOR<BewertungCreateWithoutGerichtInput, BewertungUncheckedCreateWithoutGerichtInput> | BewertungCreateWithoutGerichtInput[] | BewertungUncheckedCreateWithoutGerichtInput[]
    connectOrCreate?: BewertungCreateOrConnectWithoutGerichtInput | BewertungCreateOrConnectWithoutGerichtInput[]
    upsert?: BewertungUpsertWithWhereUniqueWithoutGerichtInput | BewertungUpsertWithWhereUniqueWithoutGerichtInput[]
    createMany?: BewertungCreateManyGerichtInputEnvelope
    set?: BewertungWhereUniqueInput | BewertungWhereUniqueInput[]
    disconnect?: BewertungWhereUniqueInput | BewertungWhereUniqueInput[]
    delete?: BewertungWhereUniqueInput | BewertungWhereUniqueInput[]
    connect?: BewertungWhereUniqueInput | BewertungWhereUniqueInput[]
    update?: BewertungUpdateWithWhereUniqueWithoutGerichtInput | BewertungUpdateWithWhereUniqueWithoutGerichtInput[]
    updateMany?: BewertungUpdateManyWithWhereWithoutGerichtInput | BewertungUpdateManyWithWhereWithoutGerichtInput[]
    deleteMany?: BewertungScalarWhereInput | BewertungScalarWhereInput[]
  }

  export type GerichtCreateNestedManyWithoutZutatenInput = {
    create?: XOR<GerichtCreateWithoutZutatenInput, GerichtUncheckedCreateWithoutZutatenInput> | GerichtCreateWithoutZutatenInput[] | GerichtUncheckedCreateWithoutZutatenInput[]
    connectOrCreate?: GerichtCreateOrConnectWithoutZutatenInput | GerichtCreateOrConnectWithoutZutatenInput[]
    connect?: GerichtWhereUniqueInput | GerichtWhereUniqueInput[]
  }

  export type GerichtUncheckedCreateNestedManyWithoutZutatenInput = {
    create?: XOR<GerichtCreateWithoutZutatenInput, GerichtUncheckedCreateWithoutZutatenInput> | GerichtCreateWithoutZutatenInput[] | GerichtUncheckedCreateWithoutZutatenInput[]
    connectOrCreate?: GerichtCreateOrConnectWithoutZutatenInput | GerichtCreateOrConnectWithoutZutatenInput[]
    connect?: GerichtWhereUniqueInput | GerichtWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type GerichtUpdateManyWithoutZutatenNestedInput = {
    create?: XOR<GerichtCreateWithoutZutatenInput, GerichtUncheckedCreateWithoutZutatenInput> | GerichtCreateWithoutZutatenInput[] | GerichtUncheckedCreateWithoutZutatenInput[]
    connectOrCreate?: GerichtCreateOrConnectWithoutZutatenInput | GerichtCreateOrConnectWithoutZutatenInput[]
    upsert?: GerichtUpsertWithWhereUniqueWithoutZutatenInput | GerichtUpsertWithWhereUniqueWithoutZutatenInput[]
    set?: GerichtWhereUniqueInput | GerichtWhereUniqueInput[]
    disconnect?: GerichtWhereUniqueInput | GerichtWhereUniqueInput[]
    delete?: GerichtWhereUniqueInput | GerichtWhereUniqueInput[]
    connect?: GerichtWhereUniqueInput | GerichtWhereUniqueInput[]
    update?: GerichtUpdateWithWhereUniqueWithoutZutatenInput | GerichtUpdateWithWhereUniqueWithoutZutatenInput[]
    updateMany?: GerichtUpdateManyWithWhereWithoutZutatenInput | GerichtUpdateManyWithWhereWithoutZutatenInput[]
    deleteMany?: GerichtScalarWhereInput | GerichtScalarWhereInput[]
  }

  export type GerichtUncheckedUpdateManyWithoutZutatenNestedInput = {
    create?: XOR<GerichtCreateWithoutZutatenInput, GerichtUncheckedCreateWithoutZutatenInput> | GerichtCreateWithoutZutatenInput[] | GerichtUncheckedCreateWithoutZutatenInput[]
    connectOrCreate?: GerichtCreateOrConnectWithoutZutatenInput | GerichtCreateOrConnectWithoutZutatenInput[]
    upsert?: GerichtUpsertWithWhereUniqueWithoutZutatenInput | GerichtUpsertWithWhereUniqueWithoutZutatenInput[]
    set?: GerichtWhereUniqueInput | GerichtWhereUniqueInput[]
    disconnect?: GerichtWhereUniqueInput | GerichtWhereUniqueInput[]
    delete?: GerichtWhereUniqueInput | GerichtWhereUniqueInput[]
    connect?: GerichtWhereUniqueInput | GerichtWhereUniqueInput[]
    update?: GerichtUpdateWithWhereUniqueWithoutZutatenInput | GerichtUpdateWithWhereUniqueWithoutZutatenInput[]
    updateMany?: GerichtUpdateManyWithWhereWithoutZutatenInput | GerichtUpdateManyWithWhereWithoutZutatenInput[]
    deleteMany?: GerichtScalarWhereInput | GerichtScalarWhereInput[]
  }

  export type GerichtCreateNestedOneWithoutBewertungInput = {
    create?: XOR<GerichtCreateWithoutBewertungInput, GerichtUncheckedCreateWithoutBewertungInput>
    connectOrCreate?: GerichtCreateOrConnectWithoutBewertungInput
    connect?: GerichtWhereUniqueInput
  }

  export type GerichtUpdateOneRequiredWithoutBewertungNestedInput = {
    create?: XOR<GerichtCreateWithoutBewertungInput, GerichtUncheckedCreateWithoutBewertungInput>
    connectOrCreate?: GerichtCreateOrConnectWithoutBewertungInput
    upsert?: GerichtUpsertWithoutBewertungInput
    connect?: GerichtWhereUniqueInput
    update?: XOR<XOR<GerichtUpdateToOneWithWhereWithoutBewertungInput, GerichtUpdateWithoutBewertungInput>, GerichtUncheckedUpdateWithoutBewertungInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type SessionCreateWithoutUsersInput = {
    id?: string
    timeIn: Date | string
  }

  export type SessionUncheckedCreateWithoutUsersInput = {
    id?: string
    timeIn: Date | string
  }

  export type SessionCreateOrConnectWithoutUsersInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUsersInput, SessionUncheckedCreateWithoutUsersInput>
  }

  export type SessionUpsertWithoutUsersInput = {
    update: XOR<SessionUpdateWithoutUsersInput, SessionUncheckedUpdateWithoutUsersInput>
    create: XOR<SessionCreateWithoutUsersInput, SessionUncheckedCreateWithoutUsersInput>
    where?: SessionWhereInput
  }

  export type SessionUpdateToOneWithWhereWithoutUsersInput = {
    where?: SessionWhereInput
    data: XOR<SessionUpdateWithoutUsersInput, SessionUncheckedUpdateWithoutUsersInput>
  }

  export type SessionUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    timeIn?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    timeIn?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutSessionInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    createdAt?: Date | string
  }

  export type UserUncheckedCreateWithoutSessionInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    createdAt?: Date | string
  }

  export type UserCreateOrConnectWithoutSessionInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionInput, UserUncheckedCreateWithoutSessionInput>
  }

  export type UserCreateManySessionInputEnvelope = {
    data: UserCreateManySessionInput | UserCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutSessionInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutSessionInput, UserUncheckedUpdateWithoutSessionInput>
    create: XOR<UserCreateWithoutSessionInput, UserUncheckedCreateWithoutSessionInput>
  }

  export type UserUpdateWithWhereUniqueWithoutSessionInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutSessionInput, UserUncheckedUpdateWithoutSessionInput>
  }

  export type UserUpdateManyWithWhereWithoutSessionInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutSessionInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    sessionID?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
  }

  export type MenuCreateWithoutRestaurantInput = {
    name: string
    beschreibung?: string | null
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
    kategorien?: KategorieCreateNestedManyWithoutMenuInput
  }

  export type MenuUncheckedCreateWithoutRestaurantInput = {
    id?: number
    name: string
    beschreibung?: string | null
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
    kategorien?: KategorieUncheckedCreateNestedManyWithoutMenuInput
  }

  export type MenuCreateOrConnectWithoutRestaurantInput = {
    where: MenuWhereUniqueInput
    create: XOR<MenuCreateWithoutRestaurantInput, MenuUncheckedCreateWithoutRestaurantInput>
  }

  export type LocationCreateWithoutRestaurantInput = {
    id?: string
    street: string
    Hausnummer: string
    town: string
    postcode: string
    country: string
    reservierung?: ReservierungCreateNestedOneWithoutLocationInput
  }

  export type LocationUncheckedCreateWithoutRestaurantInput = {
    id?: string
    street: string
    Hausnummer: string
    town: string
    postcode: string
    country: string
    reservierung?: ReservierungUncheckedCreateNestedOneWithoutLocationInput
  }

  export type LocationCreateOrConnectWithoutRestaurantInput = {
    where: LocationWhereUniqueInput
    create: XOR<LocationCreateWithoutRestaurantInput, LocationUncheckedCreateWithoutRestaurantInput>
  }

  export type LocationCreateManyRestaurantInputEnvelope = {
    data: LocationCreateManyRestaurantInput | LocationCreateManyRestaurantInput[]
    skipDuplicates?: boolean
  }

  export type ReservierungCreateWithoutRestaurantInput = {
    id?: string
    phoneNum: string
    location: LocationCreateNestedOneWithoutReservierungInput
  }

  export type ReservierungUncheckedCreateWithoutRestaurantInput = {
    id?: string
    locationID: string
    phoneNum: string
  }

  export type ReservierungCreateOrConnectWithoutRestaurantInput = {
    where: ReservierungWhereUniqueInput
    create: XOR<ReservierungCreateWithoutRestaurantInput, ReservierungUncheckedCreateWithoutRestaurantInput>
  }

  export type ReservierungCreateManyRestaurantInputEnvelope = {
    data: ReservierungCreateManyRestaurantInput | ReservierungCreateManyRestaurantInput[]
    skipDuplicates?: boolean
  }

  export type MenuUpsertWithoutRestaurantInput = {
    update: XOR<MenuUpdateWithoutRestaurantInput, MenuUncheckedUpdateWithoutRestaurantInput>
    create: XOR<MenuCreateWithoutRestaurantInput, MenuUncheckedCreateWithoutRestaurantInput>
    where?: MenuWhereInput
  }

  export type MenuUpdateToOneWithWhereWithoutRestaurantInput = {
    where?: MenuWhereInput
    data: XOR<MenuUpdateWithoutRestaurantInput, MenuUncheckedUpdateWithoutRestaurantInput>
  }

  export type MenuUpdateWithoutRestaurantInput = {
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
    kategorien?: KategorieUpdateManyWithoutMenuNestedInput
  }

  export type MenuUncheckedUpdateWithoutRestaurantInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
    kategorien?: KategorieUncheckedUpdateManyWithoutMenuNestedInput
  }

  export type LocationUpsertWithWhereUniqueWithoutRestaurantInput = {
    where: LocationWhereUniqueInput
    update: XOR<LocationUpdateWithoutRestaurantInput, LocationUncheckedUpdateWithoutRestaurantInput>
    create: XOR<LocationCreateWithoutRestaurantInput, LocationUncheckedCreateWithoutRestaurantInput>
  }

  export type LocationUpdateWithWhereUniqueWithoutRestaurantInput = {
    where: LocationWhereUniqueInput
    data: XOR<LocationUpdateWithoutRestaurantInput, LocationUncheckedUpdateWithoutRestaurantInput>
  }

  export type LocationUpdateManyWithWhereWithoutRestaurantInput = {
    where: LocationScalarWhereInput
    data: XOR<LocationUpdateManyMutationInput, LocationUncheckedUpdateManyWithoutRestaurantInput>
  }

  export type LocationScalarWhereInput = {
    AND?: LocationScalarWhereInput | LocationScalarWhereInput[]
    OR?: LocationScalarWhereInput[]
    NOT?: LocationScalarWhereInput | LocationScalarWhereInput[]
    id?: StringFilter<"Location"> | string
    street?: StringFilter<"Location"> | string
    Hausnummer?: StringFilter<"Location"> | string
    town?: StringFilter<"Location"> | string
    postcode?: StringFilter<"Location"> | string
    country?: StringFilter<"Location"> | string
    restaurantID?: StringFilter<"Location"> | string
  }

  export type ReservierungUpsertWithWhereUniqueWithoutRestaurantInput = {
    where: ReservierungWhereUniqueInput
    update: XOR<ReservierungUpdateWithoutRestaurantInput, ReservierungUncheckedUpdateWithoutRestaurantInput>
    create: XOR<ReservierungCreateWithoutRestaurantInput, ReservierungUncheckedCreateWithoutRestaurantInput>
  }

  export type ReservierungUpdateWithWhereUniqueWithoutRestaurantInput = {
    where: ReservierungWhereUniqueInput
    data: XOR<ReservierungUpdateWithoutRestaurantInput, ReservierungUncheckedUpdateWithoutRestaurantInput>
  }

  export type ReservierungUpdateManyWithWhereWithoutRestaurantInput = {
    where: ReservierungScalarWhereInput
    data: XOR<ReservierungUpdateManyMutationInput, ReservierungUncheckedUpdateManyWithoutRestaurantInput>
  }

  export type ReservierungScalarWhereInput = {
    AND?: ReservierungScalarWhereInput | ReservierungScalarWhereInput[]
    OR?: ReservierungScalarWhereInput[]
    NOT?: ReservierungScalarWhereInput | ReservierungScalarWhereInput[]
    id?: StringFilter<"Reservierung"> | string
    locationID?: StringFilter<"Reservierung"> | string
    restaurantID?: StringFilter<"Reservierung"> | string
    phoneNum?: StringFilter<"Reservierung"> | string
  }

  export type RestaurantCreateWithoutLocationInput = {
    id?: string
    name: string
    parrentCompName: string
    parrentCompID: string
    menuId: string
    memberSince?: Date | string
    locationID: string
    menu?: MenuCreateNestedOneWithoutRestaurantInput
    reservierung?: ReservierungCreateNestedManyWithoutRestaurantInput
  }

  export type RestaurantUncheckedCreateWithoutLocationInput = {
    id?: string
    name: string
    parrentCompName: string
    parrentCompID: string
    menuId: string
    memberSince?: Date | string
    locationID: string
    menu?: MenuUncheckedCreateNestedOneWithoutRestaurantInput
    reservierung?: ReservierungUncheckedCreateNestedManyWithoutRestaurantInput
  }

  export type RestaurantCreateOrConnectWithoutLocationInput = {
    where: RestaurantWhereUniqueInput
    create: XOR<RestaurantCreateWithoutLocationInput, RestaurantUncheckedCreateWithoutLocationInput>
  }

  export type ReservierungCreateWithoutLocationInput = {
    id?: string
    phoneNum: string
    restaurant: RestaurantCreateNestedOneWithoutReservierungInput
  }

  export type ReservierungUncheckedCreateWithoutLocationInput = {
    id?: string
    restaurantID: string
    phoneNum: string
  }

  export type ReservierungCreateOrConnectWithoutLocationInput = {
    where: ReservierungWhereUniqueInput
    create: XOR<ReservierungCreateWithoutLocationInput, ReservierungUncheckedCreateWithoutLocationInput>
  }

  export type RestaurantUpsertWithoutLocationInput = {
    update: XOR<RestaurantUpdateWithoutLocationInput, RestaurantUncheckedUpdateWithoutLocationInput>
    create: XOR<RestaurantCreateWithoutLocationInput, RestaurantUncheckedCreateWithoutLocationInput>
    where?: RestaurantWhereInput
  }

  export type RestaurantUpdateToOneWithWhereWithoutLocationInput = {
    where?: RestaurantWhereInput
    data: XOR<RestaurantUpdateWithoutLocationInput, RestaurantUncheckedUpdateWithoutLocationInput>
  }

  export type RestaurantUpdateWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    parrentCompName?: StringFieldUpdateOperationsInput | string
    parrentCompID?: StringFieldUpdateOperationsInput | string
    menuId?: StringFieldUpdateOperationsInput | string
    memberSince?: DateTimeFieldUpdateOperationsInput | Date | string
    locationID?: StringFieldUpdateOperationsInput | string
    menu?: MenuUpdateOneWithoutRestaurantNestedInput
    reservierung?: ReservierungUpdateManyWithoutRestaurantNestedInput
  }

  export type RestaurantUncheckedUpdateWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    parrentCompName?: StringFieldUpdateOperationsInput | string
    parrentCompID?: StringFieldUpdateOperationsInput | string
    menuId?: StringFieldUpdateOperationsInput | string
    memberSince?: DateTimeFieldUpdateOperationsInput | Date | string
    locationID?: StringFieldUpdateOperationsInput | string
    menu?: MenuUncheckedUpdateOneWithoutRestaurantNestedInput
    reservierung?: ReservierungUncheckedUpdateManyWithoutRestaurantNestedInput
  }

  export type ReservierungUpsertWithoutLocationInput = {
    update: XOR<ReservierungUpdateWithoutLocationInput, ReservierungUncheckedUpdateWithoutLocationInput>
    create: XOR<ReservierungCreateWithoutLocationInput, ReservierungUncheckedCreateWithoutLocationInput>
    where?: ReservierungWhereInput
  }

  export type ReservierungUpdateToOneWithWhereWithoutLocationInput = {
    where?: ReservierungWhereInput
    data: XOR<ReservierungUpdateWithoutLocationInput, ReservierungUncheckedUpdateWithoutLocationInput>
  }

  export type ReservierungUpdateWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNum?: StringFieldUpdateOperationsInput | string
    restaurant?: RestaurantUpdateOneRequiredWithoutReservierungNestedInput
  }

  export type ReservierungUncheckedUpdateWithoutLocationInput = {
    id?: StringFieldUpdateOperationsInput | string
    restaurantID?: StringFieldUpdateOperationsInput | string
    phoneNum?: StringFieldUpdateOperationsInput | string
  }

  export type LocationCreateWithoutReservierungInput = {
    id?: string
    street: string
    Hausnummer: string
    town: string
    postcode: string
    country: string
    restaurant: RestaurantCreateNestedOneWithoutLocationInput
  }

  export type LocationUncheckedCreateWithoutReservierungInput = {
    id?: string
    street: string
    Hausnummer: string
    town: string
    postcode: string
    country: string
    restaurantID: string
  }

  export type LocationCreateOrConnectWithoutReservierungInput = {
    where: LocationWhereUniqueInput
    create: XOR<LocationCreateWithoutReservierungInput, LocationUncheckedCreateWithoutReservierungInput>
  }

  export type RestaurantCreateWithoutReservierungInput = {
    id?: string
    name: string
    parrentCompName: string
    parrentCompID: string
    menuId: string
    memberSince?: Date | string
    locationID: string
    menu?: MenuCreateNestedOneWithoutRestaurantInput
    location?: LocationCreateNestedManyWithoutRestaurantInput
  }

  export type RestaurantUncheckedCreateWithoutReservierungInput = {
    id?: string
    name: string
    parrentCompName: string
    parrentCompID: string
    menuId: string
    memberSince?: Date | string
    locationID: string
    menu?: MenuUncheckedCreateNestedOneWithoutRestaurantInput
    location?: LocationUncheckedCreateNestedManyWithoutRestaurantInput
  }

  export type RestaurantCreateOrConnectWithoutReservierungInput = {
    where: RestaurantWhereUniqueInput
    create: XOR<RestaurantCreateWithoutReservierungInput, RestaurantUncheckedCreateWithoutReservierungInput>
  }

  export type LocationUpsertWithoutReservierungInput = {
    update: XOR<LocationUpdateWithoutReservierungInput, LocationUncheckedUpdateWithoutReservierungInput>
    create: XOR<LocationCreateWithoutReservierungInput, LocationUncheckedCreateWithoutReservierungInput>
    where?: LocationWhereInput
  }

  export type LocationUpdateToOneWithWhereWithoutReservierungInput = {
    where?: LocationWhereInput
    data: XOR<LocationUpdateWithoutReservierungInput, LocationUncheckedUpdateWithoutReservierungInput>
  }

  export type LocationUpdateWithoutReservierungInput = {
    id?: StringFieldUpdateOperationsInput | string
    street?: StringFieldUpdateOperationsInput | string
    Hausnummer?: StringFieldUpdateOperationsInput | string
    town?: StringFieldUpdateOperationsInput | string
    postcode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    restaurant?: RestaurantUpdateOneRequiredWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateWithoutReservierungInput = {
    id?: StringFieldUpdateOperationsInput | string
    street?: StringFieldUpdateOperationsInput | string
    Hausnummer?: StringFieldUpdateOperationsInput | string
    town?: StringFieldUpdateOperationsInput | string
    postcode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    restaurantID?: StringFieldUpdateOperationsInput | string
  }

  export type RestaurantUpsertWithoutReservierungInput = {
    update: XOR<RestaurantUpdateWithoutReservierungInput, RestaurantUncheckedUpdateWithoutReservierungInput>
    create: XOR<RestaurantCreateWithoutReservierungInput, RestaurantUncheckedCreateWithoutReservierungInput>
    where?: RestaurantWhereInput
  }

  export type RestaurantUpdateToOneWithWhereWithoutReservierungInput = {
    where?: RestaurantWhereInput
    data: XOR<RestaurantUpdateWithoutReservierungInput, RestaurantUncheckedUpdateWithoutReservierungInput>
  }

  export type RestaurantUpdateWithoutReservierungInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    parrentCompName?: StringFieldUpdateOperationsInput | string
    parrentCompID?: StringFieldUpdateOperationsInput | string
    menuId?: StringFieldUpdateOperationsInput | string
    memberSince?: DateTimeFieldUpdateOperationsInput | Date | string
    locationID?: StringFieldUpdateOperationsInput | string
    menu?: MenuUpdateOneWithoutRestaurantNestedInput
    location?: LocationUpdateManyWithoutRestaurantNestedInput
  }

  export type RestaurantUncheckedUpdateWithoutReservierungInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    parrentCompName?: StringFieldUpdateOperationsInput | string
    parrentCompID?: StringFieldUpdateOperationsInput | string
    menuId?: StringFieldUpdateOperationsInput | string
    memberSince?: DateTimeFieldUpdateOperationsInput | Date | string
    locationID?: StringFieldUpdateOperationsInput | string
    menu?: MenuUncheckedUpdateOneWithoutRestaurantNestedInput
    location?: LocationUncheckedUpdateManyWithoutRestaurantNestedInput
  }

  export type KategorieCreateWithoutMenuInput = {
    name: string
    beschreibung?: string | null
    gerichte?: GerichtCreateNestedManyWithoutKategorieInput
  }

  export type KategorieUncheckedCreateWithoutMenuInput = {
    id?: number
    name: string
    beschreibung?: string | null
    gerichte?: GerichtUncheckedCreateNestedManyWithoutKategorieInput
  }

  export type KategorieCreateOrConnectWithoutMenuInput = {
    where: KategorieWhereUniqueInput
    create: XOR<KategorieCreateWithoutMenuInput, KategorieUncheckedCreateWithoutMenuInput>
  }

  export type KategorieCreateManyMenuInputEnvelope = {
    data: KategorieCreateManyMenuInput | KategorieCreateManyMenuInput[]
    skipDuplicates?: boolean
  }

  export type RestaurantCreateWithoutMenuInput = {
    id?: string
    name: string
    parrentCompName: string
    parrentCompID: string
    menuId: string
    memberSince?: Date | string
    locationID: string
    location?: LocationCreateNestedManyWithoutRestaurantInput
    reservierung?: ReservierungCreateNestedManyWithoutRestaurantInput
  }

  export type RestaurantUncheckedCreateWithoutMenuInput = {
    id?: string
    name: string
    parrentCompName: string
    parrentCompID: string
    menuId: string
    memberSince?: Date | string
    locationID: string
    location?: LocationUncheckedCreateNestedManyWithoutRestaurantInput
    reservierung?: ReservierungUncheckedCreateNestedManyWithoutRestaurantInput
  }

  export type RestaurantCreateOrConnectWithoutMenuInput = {
    where: RestaurantWhereUniqueInput
    create: XOR<RestaurantCreateWithoutMenuInput, RestaurantUncheckedCreateWithoutMenuInput>
  }

  export type KategorieUpsertWithWhereUniqueWithoutMenuInput = {
    where: KategorieWhereUniqueInput
    update: XOR<KategorieUpdateWithoutMenuInput, KategorieUncheckedUpdateWithoutMenuInput>
    create: XOR<KategorieCreateWithoutMenuInput, KategorieUncheckedCreateWithoutMenuInput>
  }

  export type KategorieUpdateWithWhereUniqueWithoutMenuInput = {
    where: KategorieWhereUniqueInput
    data: XOR<KategorieUpdateWithoutMenuInput, KategorieUncheckedUpdateWithoutMenuInput>
  }

  export type KategorieUpdateManyWithWhereWithoutMenuInput = {
    where: KategorieScalarWhereInput
    data: XOR<KategorieUpdateManyMutationInput, KategorieUncheckedUpdateManyWithoutMenuInput>
  }

  export type KategorieScalarWhereInput = {
    AND?: KategorieScalarWhereInput | KategorieScalarWhereInput[]
    OR?: KategorieScalarWhereInput[]
    NOT?: KategorieScalarWhereInput | KategorieScalarWhereInput[]
    id?: IntFilter<"Kategorie"> | number
    name?: StringFilter<"Kategorie"> | string
    beschreibung?: StringNullableFilter<"Kategorie"> | string | null
    menuId?: IntFilter<"Kategorie"> | number
  }

  export type RestaurantUpsertWithoutMenuInput = {
    update: XOR<RestaurantUpdateWithoutMenuInput, RestaurantUncheckedUpdateWithoutMenuInput>
    create: XOR<RestaurantCreateWithoutMenuInput, RestaurantUncheckedCreateWithoutMenuInput>
    where?: RestaurantWhereInput
  }

  export type RestaurantUpdateToOneWithWhereWithoutMenuInput = {
    where?: RestaurantWhereInput
    data: XOR<RestaurantUpdateWithoutMenuInput, RestaurantUncheckedUpdateWithoutMenuInput>
  }

  export type RestaurantUpdateWithoutMenuInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    parrentCompName?: StringFieldUpdateOperationsInput | string
    parrentCompID?: StringFieldUpdateOperationsInput | string
    menuId?: StringFieldUpdateOperationsInput | string
    memberSince?: DateTimeFieldUpdateOperationsInput | Date | string
    locationID?: StringFieldUpdateOperationsInput | string
    location?: LocationUpdateManyWithoutRestaurantNestedInput
    reservierung?: ReservierungUpdateManyWithoutRestaurantNestedInput
  }

  export type RestaurantUncheckedUpdateWithoutMenuInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    parrentCompName?: StringFieldUpdateOperationsInput | string
    parrentCompID?: StringFieldUpdateOperationsInput | string
    menuId?: StringFieldUpdateOperationsInput | string
    memberSince?: DateTimeFieldUpdateOperationsInput | Date | string
    locationID?: StringFieldUpdateOperationsInput | string
    location?: LocationUncheckedUpdateManyWithoutRestaurantNestedInput
    reservierung?: ReservierungUncheckedUpdateManyWithoutRestaurantNestedInput
  }

  export type MenuCreateWithoutKategorienInput = {
    name: string
    beschreibung?: string | null
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
    restaurant: RestaurantCreateNestedOneWithoutMenuInput
  }

  export type MenuUncheckedCreateWithoutKategorienInput = {
    id?: number
    name: string
    beschreibung?: string | null
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
    restaurantID: string
  }

  export type MenuCreateOrConnectWithoutKategorienInput = {
    where: MenuWhereUniqueInput
    create: XOR<MenuCreateWithoutKategorienInput, MenuUncheckedCreateWithoutKategorienInput>
  }

  export type GerichtCreateWithoutKategorieInput = {
    name: string
    beschreibung?: string | null
    preis: number
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
    img: string
    zutaten?: ZutatCreateNestedManyWithoutGerichteInput
    Bewertung?: BewertungCreateNestedManyWithoutGerichtInput
  }

  export type GerichtUncheckedCreateWithoutKategorieInput = {
    id?: number
    name: string
    beschreibung?: string | null
    preis: number
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
    img: string
    zutaten?: ZutatUncheckedCreateNestedManyWithoutGerichteInput
    Bewertung?: BewertungUncheckedCreateNestedManyWithoutGerichtInput
  }

  export type GerichtCreateOrConnectWithoutKategorieInput = {
    where: GerichtWhereUniqueInput
    create: XOR<GerichtCreateWithoutKategorieInput, GerichtUncheckedCreateWithoutKategorieInput>
  }

  export type GerichtCreateManyKategorieInputEnvelope = {
    data: GerichtCreateManyKategorieInput | GerichtCreateManyKategorieInput[]
    skipDuplicates?: boolean
  }

  export type MenuUpsertWithoutKategorienInput = {
    update: XOR<MenuUpdateWithoutKategorienInput, MenuUncheckedUpdateWithoutKategorienInput>
    create: XOR<MenuCreateWithoutKategorienInput, MenuUncheckedCreateWithoutKategorienInput>
    where?: MenuWhereInput
  }

  export type MenuUpdateToOneWithWhereWithoutKategorienInput = {
    where?: MenuWhereInput
    data: XOR<MenuUpdateWithoutKategorienInput, MenuUncheckedUpdateWithoutKategorienInput>
  }

  export type MenuUpdateWithoutKategorienInput = {
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
    restaurant?: RestaurantUpdateOneRequiredWithoutMenuNestedInput
  }

  export type MenuUncheckedUpdateWithoutKategorienInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
    restaurantID?: StringFieldUpdateOperationsInput | string
  }

  export type GerichtUpsertWithWhereUniqueWithoutKategorieInput = {
    where: GerichtWhereUniqueInput
    update: XOR<GerichtUpdateWithoutKategorieInput, GerichtUncheckedUpdateWithoutKategorieInput>
    create: XOR<GerichtCreateWithoutKategorieInput, GerichtUncheckedCreateWithoutKategorieInput>
  }

  export type GerichtUpdateWithWhereUniqueWithoutKategorieInput = {
    where: GerichtWhereUniqueInput
    data: XOR<GerichtUpdateWithoutKategorieInput, GerichtUncheckedUpdateWithoutKategorieInput>
  }

  export type GerichtUpdateManyWithWhereWithoutKategorieInput = {
    where: GerichtScalarWhereInput
    data: XOR<GerichtUpdateManyMutationInput, GerichtUncheckedUpdateManyWithoutKategorieInput>
  }

  export type GerichtScalarWhereInput = {
    AND?: GerichtScalarWhereInput | GerichtScalarWhereInput[]
    OR?: GerichtScalarWhereInput[]
    NOT?: GerichtScalarWhereInput | GerichtScalarWhereInput[]
    id?: IntFilter<"Gericht"> | number
    name?: StringFilter<"Gericht"> | string
    beschreibung?: StringNullableFilter<"Gericht"> | string | null
    preis?: FloatFilter<"Gericht"> | number
    kategorieId?: IntFilter<"Gericht"> | number
    erstelltAm?: DateTimeFilter<"Gericht"> | Date | string
    aktualisiertAm?: DateTimeFilter<"Gericht"> | Date | string
    img?: StringFilter<"Gericht"> | string
  }

  export type KategorieCreateWithoutGerichteInput = {
    name: string
    beschreibung?: string | null
    menu: MenuCreateNestedOneWithoutKategorienInput
  }

  export type KategorieUncheckedCreateWithoutGerichteInput = {
    id?: number
    name: string
    beschreibung?: string | null
    menuId: number
  }

  export type KategorieCreateOrConnectWithoutGerichteInput = {
    where: KategorieWhereUniqueInput
    create: XOR<KategorieCreateWithoutGerichteInput, KategorieUncheckedCreateWithoutGerichteInput>
  }

  export type ZutatCreateWithoutGerichteInput = {
    name: string
    istAllergen?: boolean
  }

  export type ZutatUncheckedCreateWithoutGerichteInput = {
    id?: number
    name: string
    istAllergen?: boolean
  }

  export type ZutatCreateOrConnectWithoutGerichteInput = {
    where: ZutatWhereUniqueInput
    create: XOR<ZutatCreateWithoutGerichteInput, ZutatUncheckedCreateWithoutGerichteInput>
  }

  export type BewertungCreateWithoutGerichtInput = {
    bewertung?: number
    kommentar?: string | null
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
  }

  export type BewertungUncheckedCreateWithoutGerichtInput = {
    id?: number
    bewertung?: number
    kommentar?: string | null
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
  }

  export type BewertungCreateOrConnectWithoutGerichtInput = {
    where: BewertungWhereUniqueInput
    create: XOR<BewertungCreateWithoutGerichtInput, BewertungUncheckedCreateWithoutGerichtInput>
  }

  export type BewertungCreateManyGerichtInputEnvelope = {
    data: BewertungCreateManyGerichtInput | BewertungCreateManyGerichtInput[]
    skipDuplicates?: boolean
  }

  export type KategorieUpsertWithoutGerichteInput = {
    update: XOR<KategorieUpdateWithoutGerichteInput, KategorieUncheckedUpdateWithoutGerichteInput>
    create: XOR<KategorieCreateWithoutGerichteInput, KategorieUncheckedCreateWithoutGerichteInput>
    where?: KategorieWhereInput
  }

  export type KategorieUpdateToOneWithWhereWithoutGerichteInput = {
    where?: KategorieWhereInput
    data: XOR<KategorieUpdateWithoutGerichteInput, KategorieUncheckedUpdateWithoutGerichteInput>
  }

  export type KategorieUpdateWithoutGerichteInput = {
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    menu?: MenuUpdateOneRequiredWithoutKategorienNestedInput
  }

  export type KategorieUncheckedUpdateWithoutGerichteInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    menuId?: IntFieldUpdateOperationsInput | number
  }

  export type ZutatUpsertWithWhereUniqueWithoutGerichteInput = {
    where: ZutatWhereUniqueInput
    update: XOR<ZutatUpdateWithoutGerichteInput, ZutatUncheckedUpdateWithoutGerichteInput>
    create: XOR<ZutatCreateWithoutGerichteInput, ZutatUncheckedCreateWithoutGerichteInput>
  }

  export type ZutatUpdateWithWhereUniqueWithoutGerichteInput = {
    where: ZutatWhereUniqueInput
    data: XOR<ZutatUpdateWithoutGerichteInput, ZutatUncheckedUpdateWithoutGerichteInput>
  }

  export type ZutatUpdateManyWithWhereWithoutGerichteInput = {
    where: ZutatScalarWhereInput
    data: XOR<ZutatUpdateManyMutationInput, ZutatUncheckedUpdateManyWithoutGerichteInput>
  }

  export type ZutatScalarWhereInput = {
    AND?: ZutatScalarWhereInput | ZutatScalarWhereInput[]
    OR?: ZutatScalarWhereInput[]
    NOT?: ZutatScalarWhereInput | ZutatScalarWhereInput[]
    id?: IntFilter<"Zutat"> | number
    name?: StringFilter<"Zutat"> | string
    istAllergen?: BoolFilter<"Zutat"> | boolean
  }

  export type BewertungUpsertWithWhereUniqueWithoutGerichtInput = {
    where: BewertungWhereUniqueInput
    update: XOR<BewertungUpdateWithoutGerichtInput, BewertungUncheckedUpdateWithoutGerichtInput>
    create: XOR<BewertungCreateWithoutGerichtInput, BewertungUncheckedCreateWithoutGerichtInput>
  }

  export type BewertungUpdateWithWhereUniqueWithoutGerichtInput = {
    where: BewertungWhereUniqueInput
    data: XOR<BewertungUpdateWithoutGerichtInput, BewertungUncheckedUpdateWithoutGerichtInput>
  }

  export type BewertungUpdateManyWithWhereWithoutGerichtInput = {
    where: BewertungScalarWhereInput
    data: XOR<BewertungUpdateManyMutationInput, BewertungUncheckedUpdateManyWithoutGerichtInput>
  }

  export type BewertungScalarWhereInput = {
    AND?: BewertungScalarWhereInput | BewertungScalarWhereInput[]
    OR?: BewertungScalarWhereInput[]
    NOT?: BewertungScalarWhereInput | BewertungScalarWhereInput[]
    id?: IntFilter<"Bewertung"> | number
    gerichtId?: IntFilter<"Bewertung"> | number
    bewertung?: IntFilter<"Bewertung"> | number
    kommentar?: StringNullableFilter<"Bewertung"> | string | null
    erstelltAm?: DateTimeFilter<"Bewertung"> | Date | string
    aktualisiertAm?: DateTimeFilter<"Bewertung"> | Date | string
  }

  export type GerichtCreateWithoutZutatenInput = {
    name: string
    beschreibung?: string | null
    preis: number
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
    img: string
    kategorie: KategorieCreateNestedOneWithoutGerichteInput
    Bewertung?: BewertungCreateNestedManyWithoutGerichtInput
  }

  export type GerichtUncheckedCreateWithoutZutatenInput = {
    id?: number
    name: string
    beschreibung?: string | null
    preis: number
    kategorieId: number
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
    img: string
    Bewertung?: BewertungUncheckedCreateNestedManyWithoutGerichtInput
  }

  export type GerichtCreateOrConnectWithoutZutatenInput = {
    where: GerichtWhereUniqueInput
    create: XOR<GerichtCreateWithoutZutatenInput, GerichtUncheckedCreateWithoutZutatenInput>
  }

  export type GerichtUpsertWithWhereUniqueWithoutZutatenInput = {
    where: GerichtWhereUniqueInput
    update: XOR<GerichtUpdateWithoutZutatenInput, GerichtUncheckedUpdateWithoutZutatenInput>
    create: XOR<GerichtCreateWithoutZutatenInput, GerichtUncheckedCreateWithoutZutatenInput>
  }

  export type GerichtUpdateWithWhereUniqueWithoutZutatenInput = {
    where: GerichtWhereUniqueInput
    data: XOR<GerichtUpdateWithoutZutatenInput, GerichtUncheckedUpdateWithoutZutatenInput>
  }

  export type GerichtUpdateManyWithWhereWithoutZutatenInput = {
    where: GerichtScalarWhereInput
    data: XOR<GerichtUpdateManyMutationInput, GerichtUncheckedUpdateManyWithoutZutatenInput>
  }

  export type GerichtCreateWithoutBewertungInput = {
    name: string
    beschreibung?: string | null
    preis: number
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
    img: string
    kategorie: KategorieCreateNestedOneWithoutGerichteInput
    zutaten?: ZutatCreateNestedManyWithoutGerichteInput
  }

  export type GerichtUncheckedCreateWithoutBewertungInput = {
    id?: number
    name: string
    beschreibung?: string | null
    preis: number
    kategorieId: number
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
    img: string
    zutaten?: ZutatUncheckedCreateNestedManyWithoutGerichteInput
  }

  export type GerichtCreateOrConnectWithoutBewertungInput = {
    where: GerichtWhereUniqueInput
    create: XOR<GerichtCreateWithoutBewertungInput, GerichtUncheckedCreateWithoutBewertungInput>
  }

  export type GerichtUpsertWithoutBewertungInput = {
    update: XOR<GerichtUpdateWithoutBewertungInput, GerichtUncheckedUpdateWithoutBewertungInput>
    create: XOR<GerichtCreateWithoutBewertungInput, GerichtUncheckedCreateWithoutBewertungInput>
    where?: GerichtWhereInput
  }

  export type GerichtUpdateToOneWithWhereWithoutBewertungInput = {
    where?: GerichtWhereInput
    data: XOR<GerichtUpdateWithoutBewertungInput, GerichtUncheckedUpdateWithoutBewertungInput>
  }

  export type GerichtUpdateWithoutBewertungInput = {
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    preis?: FloatFieldUpdateOperationsInput | number
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
    img?: StringFieldUpdateOperationsInput | string
    kategorie?: KategorieUpdateOneRequiredWithoutGerichteNestedInput
    zutaten?: ZutatUpdateManyWithoutGerichteNestedInput
  }

  export type GerichtUncheckedUpdateWithoutBewertungInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    preis?: FloatFieldUpdateOperationsInput | number
    kategorieId?: IntFieldUpdateOperationsInput | number
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
    img?: StringFieldUpdateOperationsInput | string
    zutaten?: ZutatUncheckedUpdateManyWithoutGerichteNestedInput
  }

  export type UserCreateManySessionInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    role: $Enums.Role
    createdAt?: Date | string
  }

  export type UserUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationCreateManyRestaurantInput = {
    id?: string
    street: string
    Hausnummer: string
    town: string
    postcode: string
    country: string
  }

  export type ReservierungCreateManyRestaurantInput = {
    id?: string
    locationID: string
    phoneNum: string
  }

  export type LocationUpdateWithoutRestaurantInput = {
    id?: StringFieldUpdateOperationsInput | string
    street?: StringFieldUpdateOperationsInput | string
    Hausnummer?: StringFieldUpdateOperationsInput | string
    town?: StringFieldUpdateOperationsInput | string
    postcode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    reservierung?: ReservierungUpdateOneWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateWithoutRestaurantInput = {
    id?: StringFieldUpdateOperationsInput | string
    street?: StringFieldUpdateOperationsInput | string
    Hausnummer?: StringFieldUpdateOperationsInput | string
    town?: StringFieldUpdateOperationsInput | string
    postcode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    reservierung?: ReservierungUncheckedUpdateOneWithoutLocationNestedInput
  }

  export type LocationUncheckedUpdateManyWithoutRestaurantInput = {
    id?: StringFieldUpdateOperationsInput | string
    street?: StringFieldUpdateOperationsInput | string
    Hausnummer?: StringFieldUpdateOperationsInput | string
    town?: StringFieldUpdateOperationsInput | string
    postcode?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
  }

  export type ReservierungUpdateWithoutRestaurantInput = {
    id?: StringFieldUpdateOperationsInput | string
    phoneNum?: StringFieldUpdateOperationsInput | string
    location?: LocationUpdateOneRequiredWithoutReservierungNestedInput
  }

  export type ReservierungUncheckedUpdateWithoutRestaurantInput = {
    id?: StringFieldUpdateOperationsInput | string
    locationID?: StringFieldUpdateOperationsInput | string
    phoneNum?: StringFieldUpdateOperationsInput | string
  }

  export type ReservierungUncheckedUpdateManyWithoutRestaurantInput = {
    id?: StringFieldUpdateOperationsInput | string
    locationID?: StringFieldUpdateOperationsInput | string
    phoneNum?: StringFieldUpdateOperationsInput | string
  }

  export type KategorieCreateManyMenuInput = {
    id?: number
    name: string
    beschreibung?: string | null
  }

  export type KategorieUpdateWithoutMenuInput = {
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    gerichte?: GerichtUpdateManyWithoutKategorieNestedInput
  }

  export type KategorieUncheckedUpdateWithoutMenuInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    gerichte?: GerichtUncheckedUpdateManyWithoutKategorieNestedInput
  }

  export type KategorieUncheckedUpdateManyWithoutMenuInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type GerichtCreateManyKategorieInput = {
    id?: number
    name: string
    beschreibung?: string | null
    preis: number
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
    img: string
  }

  export type GerichtUpdateWithoutKategorieInput = {
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    preis?: FloatFieldUpdateOperationsInput | number
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
    img?: StringFieldUpdateOperationsInput | string
    zutaten?: ZutatUpdateManyWithoutGerichteNestedInput
    Bewertung?: BewertungUpdateManyWithoutGerichtNestedInput
  }

  export type GerichtUncheckedUpdateWithoutKategorieInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    preis?: FloatFieldUpdateOperationsInput | number
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
    img?: StringFieldUpdateOperationsInput | string
    zutaten?: ZutatUncheckedUpdateManyWithoutGerichteNestedInput
    Bewertung?: BewertungUncheckedUpdateManyWithoutGerichtNestedInput
  }

  export type GerichtUncheckedUpdateManyWithoutKategorieInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    preis?: FloatFieldUpdateOperationsInput | number
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
    img?: StringFieldUpdateOperationsInput | string
  }

  export type BewertungCreateManyGerichtInput = {
    id?: number
    bewertung?: number
    kommentar?: string | null
    erstelltAm?: Date | string
    aktualisiertAm?: Date | string
  }

  export type ZutatUpdateWithoutGerichteInput = {
    name?: StringFieldUpdateOperationsInput | string
    istAllergen?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ZutatUncheckedUpdateWithoutGerichteInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    istAllergen?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ZutatUncheckedUpdateManyWithoutGerichteInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    istAllergen?: BoolFieldUpdateOperationsInput | boolean
  }

  export type BewertungUpdateWithoutGerichtInput = {
    bewertung?: IntFieldUpdateOperationsInput | number
    kommentar?: NullableStringFieldUpdateOperationsInput | string | null
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BewertungUncheckedUpdateWithoutGerichtInput = {
    id?: IntFieldUpdateOperationsInput | number
    bewertung?: IntFieldUpdateOperationsInput | number
    kommentar?: NullableStringFieldUpdateOperationsInput | string | null
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BewertungUncheckedUpdateManyWithoutGerichtInput = {
    id?: IntFieldUpdateOperationsInput | number
    bewertung?: IntFieldUpdateOperationsInput | number
    kommentar?: NullableStringFieldUpdateOperationsInput | string | null
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GerichtUpdateWithoutZutatenInput = {
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    preis?: FloatFieldUpdateOperationsInput | number
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
    img?: StringFieldUpdateOperationsInput | string
    kategorie?: KategorieUpdateOneRequiredWithoutGerichteNestedInput
    Bewertung?: BewertungUpdateManyWithoutGerichtNestedInput
  }

  export type GerichtUncheckedUpdateWithoutZutatenInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    preis?: FloatFieldUpdateOperationsInput | number
    kategorieId?: IntFieldUpdateOperationsInput | number
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
    img?: StringFieldUpdateOperationsInput | string
    Bewertung?: BewertungUncheckedUpdateManyWithoutGerichtNestedInput
  }

  export type GerichtUncheckedUpdateManyWithoutZutatenInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    beschreibung?: NullableStringFieldUpdateOperationsInput | string | null
    preis?: FloatFieldUpdateOperationsInput | number
    kategorieId?: IntFieldUpdateOperationsInput | number
    erstelltAm?: DateTimeFieldUpdateOperationsInput | Date | string
    aktualisiertAm?: DateTimeFieldUpdateOperationsInput | Date | string
    img?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}