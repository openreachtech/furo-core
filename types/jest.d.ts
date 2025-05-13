import {
  ExpectMixins,
} from '@openreachtech/renchan-test-tools/lib/types'

interface EnhancedExpect<R = unknown>
  extends
    ExpectMixins<R>
{}

declare global {
  namespace jest {
    interface Expect extends EnhancedExpect {}
  }
}
