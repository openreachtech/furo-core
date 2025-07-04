import {
  BaseGraphqlCapsule,
  BaseGraphqlLauncher,
  BaseGraphqlPayload,

  ProgressHttpFetcher,
  HeadersParser,
  PathnameBuilder,

  BaseResponseBodyParser,
  JsonResponseBodyParser,

  BaseRestfulApiCapsule,
  BaseRestfulApiLauncher,
  BaseRestfulApiPayload,

  BaseRenchanRestfulApiCapsule,
  BaseRenchanRestfulApiLauncher,
  BaseRenchanRestfulApiPayload,

  BaseFormElementClerk,
  FormControlElementInspector,
  HashBuilder,
  UploadingPropertyPathBuilder,
  BaseLegacyFormElementClerk,

  FormControlElementClerk,

  StorageClerk,

  FieldValidator,
  ValueHashValidator,

  DomInflator,

  AnonymousClassNameAssigner,
  DerivedClassNameGenerator,
  DynamicDerivedCtorPool,
  BaseDerivedCtorRegistry,
  RestMethodRestfulApiPayloadDerivedCtorRegistry,

  RESTFUL_API_METHOD,
} from '~/index.js'

describe('Classes exported correctly', () => {
  const cases = [
    { ExportedClass: BaseGraphqlCapsule },
    { ExportedClass: BaseGraphqlLauncher },
    { ExportedClass: BaseGraphqlPayload },

    { ExportedClass: ProgressHttpFetcher },
    { ExportedClass: HeadersParser },
    { ExportedClass: PathnameBuilder },

    { ExportedClass: BaseResponseBodyParser },
    { ExportedClass: JsonResponseBodyParser },

    { ExportedClass: BaseRestfulApiCapsule },
    { ExportedClass: BaseRestfulApiLauncher },
    { ExportedClass: BaseRestfulApiPayload },

    { ExportedClass: BaseRenchanRestfulApiCapsule },
    { ExportedClass: BaseRenchanRestfulApiLauncher },
    { ExportedClass: BaseRenchanRestfulApiPayload },

    { ExportedClass: BaseFormElementClerk },
    { ExportedClass: FormControlElementInspector },
    { ExportedClass: HashBuilder },
    { ExportedClass: UploadingPropertyPathBuilder },
    { ExportedClass: BaseLegacyFormElementClerk },

    { ExportedClass: FormControlElementClerk },

    { ExportedClass: StorageClerk },

    { ExportedClass: FieldValidator },
    { ExportedClass: ValueHashValidator },

    { ExportedClass: DomInflator },

    { ExportedClass: AnonymousClassNameAssigner },
    { ExportedClass: DerivedClassNameGenerator },
    { ExportedClass: DynamicDerivedCtorPool },
    { ExportedClass: BaseDerivedCtorRegistry },
    { ExportedClass: RestMethodRestfulApiPayloadDerivedCtorRegistry },
  ]

  test.each(cases)('$#. $ExportedClass.name', ({ ExportedClass }) => {
    expect(ExportedClass)
      .toBeDefined()
  })
})

describe('Constants exported correctly', () => {
  describe('RESTFUL_API_METHOD', () => {
    test('should be fixed value', () => {
      const expected = {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        PATCH: 'PATCH',
        DELETE: 'DELETE',
        HEAD: 'HEAD',
        OPTIONS: 'OPTIONS',
        TRACE: 'TRACE',
        CONNECT: 'CONNECT',
      }

      expect(RESTFUL_API_METHOD)
        .toEqual(expected)
    })
  })
})
