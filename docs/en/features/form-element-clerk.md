# Form Element Clerk

A form element clerk reads a `<form>` element into a plain value hash, and validates that hash against rules declared on the class.

| class | responsibility |
| :-- | :-- |
| `BaseFormElementClerk` | Extracts and validates a form's values. Extend one per form. |
| `FormElementInspector` | Reads a `<form>` into a value hash. |
| `FormControlElementInspector` | Reads a single control, resolving its type. |
| `ValueHashValidator` | Validates a value hash against field rules. |
| `FieldValidator` | One rule bound to one field. |
| `HashBuilder` | Builds a nested hash from flat `a[b][c]` style keys. |
| `DomInflator` | Inflates an HTML string into elements. |

## Declaring a clerk

Override `rules` with one entry per validation. Several rules may target the same field; each carries its own message.

```javascript
import {
  BaseFormElementClerk,
} from '@openreachtech/furo'

export default class SignUpFormElementClerk extends BaseFormElementClerk {
  /** @override */
  static get rules () {
    return [
      {
        ok: (it, valueHash) => it,
        field: 'username',
        message: 'username must be set',
      },
      {
        ok: (it, valueHash) => /^\w+$/u.test(it),
        field: 'username',
        message: 'username must be alphanumeric',
      },
      {
        ok: (it, valueHash) =>
          !it || it === valueHash.password,
        field: 'password-confirmation',
        message: 'passwords do not match',
      },
    ]
  }
}
```

The `ok` function receives the field's own value as the first argument and the whole value hash as the second, which is how a rule such as a password confirmation compares two fields.

## Extracting and validating

```javascript
const formElement = document.getElementById('sign-up-form')

const formElementClerk = SignUpFormElementClerk.create({
  formElement,
})

const valueHash = formElementClerk.extractValueHash()
// { username: 'AlphaUser', password: '...', ... }

if (formElementClerk.isInvalid()) {
  const validationHash = formElementClerk.generateValidationHash()

  console.log(validationHash.message.username)
}
```

`#generateValidationHash()` returns four views of the same result.

| key | value |
| :-- | :-- |
| `valid` | Field name to `true` when every rule for it passed. |
| `invalid` | Field name to `true` when any rule for it failed. |
| `messages` | Field name to every failed rule's message. |
| `message` | Field name to the first failed rule's message. |

`#isValid()` and `#isInvalid()` collapse that to a single boolean.

## Control types

`FormElementInspector` resolves each control to a natural JavaScript value — a number for `type="number"`, a `File` for `type="file"`, an array for a multi-select or a checkbox group, and the checked member's value for a radio group. Disabled controls are skipped.

Nested names build a nested hash, so `name="user[address][city]"` reads back as `valueHash.user.address.city`. `HashBuilder` performs that assembly and can be used directly.

```javascript
import {
  HashBuilder,
} from '@openreachtech/furo'

const valueHash = HashBuilder.create()
  .setValues({
    values: [
      ['user[name]', 'Alpha'],
      ['user[address][city]', 'Tokyo'],
    ],
  })
  .buildHash()
// { user: { name: 'Alpha', address: { city: 'Tokyo' } } }
```

## Feeding a request

The extracted value hash goes straight into a payload factory, so a form submits without a hand-written mapping step.

```javascript
const payload = SignUpMutationGraphqlLauncher.createPayloadWithFormValueHash({
  valueHash: formElementClerk.extractValueHash(),
})
```

See [GraphQL Client](./graphql-client.md) and [RESTful API Client](./restful-api-client.md).

## Legacy clerk

`BaseLegacyFormElementClerk` is the earlier implementation, kept for existing code. It reads control elements directly rather than delegating to `FormElementInspector`, and does not build nested hashes. New code should use `BaseFormElementClerk`.

## Inflating HTML

`DomInflator` turns an HTML string into an array of elements, without the wrapper element that `innerHTML` on a container would leave behind.

```javascript
import {
  DomInflator,
} from '@openreachtech/furo'

const elements = DomInflator.create({
  html: '<li>Alpha</li><li>Beta</li>',
})
  .inflateElements()
// [<li>Alpha</li>, <li>Beta</li>]
```
