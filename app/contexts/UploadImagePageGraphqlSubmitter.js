/**
 * GraphQL submitter for the upload-image page.
 */
export default class UploadImagePageGraphqlSubmitter {
  /**
   * Constructor.
   *
   * @param {UploadImagePageGraphqlSubmitterParams} params - The parameters
   */
  constructor ({
    LauncherCtor,
    FormClerkCtor,
    rootElement,
    validationReference,
  }) {
    this.LauncherCtor = LauncherCtor
    this.FormClerkCtor = FormClerkCtor
    this.rootElement = rootElement

    this.validationReference = validationReference
  }

  /**
   * Factory method.
   *
   * @template {X extends typeof UploadImagePageGraphqlSubmitter ? X : never} T, X
   * @param {UploadImagePageGraphqlSubmitterFactoryParams} params - The parameters
   * @returns {InstanceType<T>} A new instance of UploadImagePageGraphqlSubmitter
   * @this {T}
   */
  static create ({
    LauncherCtor,
    FormClerkCtor,
    rootElement,
  }) {
    const validationReference = {
      valid: {},
      invalid: {},
      messages: {},
      message: {},
    }

    return /** @type {InstanceType<T>} */ (
      new this({
        LauncherCtor,
        FormClerkCtor,
        rootElement,

        validationReference,
      })
    )
  }

  /**
   * Submit <form>
   *
   * @param {{
   *   formElement: HTMLFormElement
   *   hooks?: furo.GraphqlLauncherHooks
   *   options?: Record<string, *>
   *   generateVariables?: (valueHash: Record<string, *>) => Record<string, *>
   * }} params - The parameters
   * @returns {Promise<boolean>} A promise that resolves when the form is submitted
   * @public
   */
  async submitForm ({
    formElement,
    hooks = this.launcherHooks,
    options = {},
  }) {
    const formClerk = this.FormClerkCtor.create({
      formElement,
    })

    const validation = formClerk.generateValidationHash()
    this.hydrateValidationReference({
      validation,
    })

    // Skip #launchRequest(), if invalid value hash of <form>.
    if (formClerk.isInvalid()) {
      return false
    }

    const valueHash = formClerk.extractValueHash()

    await this.invokeRequestOnEvent({
      valueHash,
      hooks,
      options,
    })

    return true
  }

  /**
   * get: Launcher hooks.
   *
   * @returns {furo.GraphqlLauncherHooks} The hooks
   */
  get launcherHooks () {
    const progressElement = document.getElementById('uploading-progress')

    return {
      async beforeRequest (payload) {
        const loadingElement = document.getElementById('loading')
        loadingElement.classList.remove('hidden')

        progressElement.setAttribute('max', '0')
        progressElement.setAttribute('value', '0')

        return false
      },
      async afterRequest (capsule) {
        setTimeout(
          () => {
            const loadingElement = document.getElementById('loading')
            loadingElement.classList.add('hidden')
          },
          300
        )
      },
      onUploadProgress ({
        request,
        progressEvent,
      }) {
        if (!progressEvent.lengthComputable) {
          return
        }

        progressElement.setAttribute('max', progressEvent.total.toString())
        progressElement.setAttribute('value', progressEvent.loaded.toString())
      },
    }
  }

  /**
   * Invokes the request on event.
   *
   * @param {{
   *   valueHash: Record<string, *>
   *   hooks: furo.GraphqlLauncherHooks
   *   options?: Record<string, *>
   * }} params - The parameters
   * @returns {Promise<void>} A promise that resolves when the request is complete
   */
  async invokeRequestOnEvent ({
    valueHash,
    hooks,
    options = {},
  }) {
    const Launcher = this.LauncherCtor

    const launcher = Launcher.create()

    const payload = Launcher.createPayloadWithFormValueHash({
      valueHash,
      options,
    })

    const capsule = await launcher.launchRequest({
      payload,
      hooks,
    })

    // console.log('capsule', capsule)

    this.hydrateResponse({
      capsule,
    })
  }

  /**
   * Hydrates the validation reference.
   *
   * @param {{
   *   validation: furo.ValidatorHashType
   * }} params - The parameters
   */
  hydrateValidationReference ({
    validation,
  }) {
    /** @type {Array<HTMLElement>} */
    const validationElements = /** @type {*} */ (
      this.rootElement.querySelectorAll('[data-validation-message]')
    )

    Array.from(validationElements)
      .forEach(element => {
        const key = element.dataset.validationMessage
          ?? ' '

        // eslint-disable-next-line no-param-reassign
        element.textContent =
          validation.message[key]
          ?? ' '
      })
  }

  /**
   * Hydrates the response.
   *
   * @param {{
   *   capsule: GraphqlType.Capsule<*>
   * }} params - The parameters
   */
  hydrateResponse ({
    capsule,
  }) {
    const contentResponseElement = this.rootElement.querySelector('[data-graphql-response="content"]')
    const errorsResponseElement = this.rootElement.querySelector('[data-graphql-response="errors"]')

    contentResponseElement.textContent = JSON.stringify(
      capsule.extractContent(),
      null,
      2
    )

    errorsResponseElement.textContent = JSON.stringify(
      capsule.extractErrors(),
      null,
      2
    )
  }
}

/**
 * @typedef {{
 *   LauncherCtor: furo.LauncherCtor
 *   FormClerkCtor: furo.FormElementClerkCtor<*>
 *   rootElement: HTMLElement
 *   validationReference: furo.ValidatorHashType
 * }} UploadImagePageGraphqlSubmitterParams
 */

/**
 * @typedef {{
 *   LauncherCtor: furo.LauncherCtor
 *   FormClerkCtor: furo.FormElementClerkCtor<*>
 *   rootElement: HTMLElement
 * }} UploadImagePageGraphqlSubmitterFactoryParams
 */
