import {
  BaseGraphqlCapsule,
  BaseGraphqlLauncher,
  BaseGraphqlPayload,

  ProgressHttpFetcher,
  HeadersParser,

  BaseFormElementClerk,
  FormControlElementClerk,
  HashBuilder,
  UploadingPropertyPathBuilder,
  BaseLegacyFormElementClerk,

  StorageClerk,

  FieldValidator,
  ValueHashValidator,

  DomInflator,
} from '~/index.js'

describe('Classes exported correctly', () => {
  const cases = [
    { ExportedClass: BaseGraphqlCapsule },
    { ExportedClass: BaseGraphqlLauncher },
    { ExportedClass: BaseGraphqlPayload },

    { ExportedClass: ProgressHttpFetcher },
    { ExportedClass: HeadersParser },

    { ExportedClass: BaseFormElementClerk },
    { ExportedClass: FormControlElementClerk },
    { ExportedClass: HashBuilder },
    { ExportedClass: UploadingPropertyPathBuilder },
    { ExportedClass: BaseLegacyFormElementClerk },

    { ExportedClass: StorageClerk },

    { ExportedClass: FieldValidator },
    { ExportedClass: ValueHashValidator },

    { ExportedClass: DomInflator },
  ]

  test.each(cases)('$#. $ExportedClass.name', ({ ExportedClass }) => {
    expect(ExportedClass)
      .toBeDefined()
  })
})
