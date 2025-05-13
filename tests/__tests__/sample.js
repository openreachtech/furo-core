describe('Sample', () => {
  test('addition', () => {
    expect(1 + 2)
      .toBe(3)
  })

  test('expect.deepContaining()', () => {
    const actual = {
      alpha: 1,
      beta: 2,
      gamma: {
        delta: 3,
        epsilon: 4,
      },
    }
    const expected = {
      alpha: 1,
      gamma: {
        delta: 3,
      },
    }

    expect(actual)
      .not
      .toEqual(expected)

    expect(actual)
      .toEqual(
        expect.deepContaining(expected)
      )
  })
})
