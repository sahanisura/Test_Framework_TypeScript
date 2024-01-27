import {assert, AssertionError} from "chai";
import {debugLogger} from "./loggerUtil.js";

/* When an assertion fails, don't throw an exception but record the failure.
Calling assertAll() will cause an exception to be thrown if at least one assertion failed.
*/
export class SoftAssert {
    private static DEFAULT_SOFT_ASSERT_MESSAGE: string = "The following assert(s) failed.";
    private assertionErrors: Error[] = [];

    public equal<T>(actual: T, expected: T, message?: string): void {
        try {
            assert.equal(actual, expected, message)
        } catch (e) {
            this.handleAssertionError(e);
        }
    }

    public isTrue<T>(value: T, message?: string): void {
        try {
            assert.isTrue(value, message)
        } catch (e) {
            this.handleAssertionError(e);
        }
    }

    //Implement other assert methods when needed.

    private handleAssertionError(e: any) {
        if (e instanceof AssertionError) {
            this.assertionErrors.push(e);
        } else {
            throw e;
        }
    }

    public assertAll(message?: string): void {
        if (this.assertionErrors.length > 0) {
            let assertionErrorBuilder: string[] = [message === undefined ? SoftAssert.DEFAULT_SOFT_ASSERT_MESSAGE : message]
            let errorNo: number = 1;
            for (const error of this.assertionErrors) {
                assertionErrorBuilder.push("\n" + "Error No: " + errorNo + "\n" + error.stack);
                errorNo++;
            }
            this.assertionErrors = [];
            const finalError: string = assertionErrorBuilder.join("\n");
            debugLogger.debug(finalError);
            throw new AssertionError(finalError);
        }
    }
}