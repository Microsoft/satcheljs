import 'jasmine';
import {
    action,
    applyMiddleware,
    createMutator,
    createStore,
    dispatch,
    mutator,
    mutatorAction,
    orchestrator,
} from '../src/index';

describe('satcheljs', () => {
    it('mutators subscribe to actions', () => {
        let actualValue;

        // Create an action creator
        let testAction = action('testAction', function testAction(value: string) {
            return {
                value: value,
            };
        });

        // Create a mutator that subscribes to it
        let onTestAction = mutator(testAction, function(actionMessage) {
            actualValue = actionMessage.value;
        });

        // Dispatch the action
        testAction('test');

        // Validate that the mutator was called with the dispatched action
        expect(actualValue).toBe('test');
    });

    it('mutatorAction dispatches an action and subscribes to it', () => {
        // Arrange
        let arg1Value;
        let arg2Value;

        let testMutatorAction = mutatorAction('testMutatorAction', function testMutatorAction(
            arg1: string,
            arg2: number
        ) {
            arg1Value = arg1;
            arg2Value = arg2;
        });

        // Act
        testMutatorAction('testValue', 2);

        // Assert
        expect(arg1Value).toBe('testValue');
        expect(arg2Value).toBe(2);
    });

    it('mutators can modify the store', () => {
        // Arrange
        let store = createStore('testStore', { testProperty: 'testValue' })();
        let modifyStore = action('modifyStore');

        let onModifyStore = mutator(modifyStore, actionMessage => {
            store.testProperty = 'newValue';
        });

        // Act
        modifyStore();

        // Assert
        expect(store.testProperty).toBe('newValue');
    });

    it('middleware gets called during dispatch', () => {
        // Arrange
        let actualValue;
        let expectedValue = { type: 'testMiddleware' };

        applyMiddleware((next, actionMessage) => {
            actualValue = actionMessage;
            next(actionMessage);
        });

        // Act
        dispatch(expectedValue);

        // Assert
        expect(actualValue).toBe(expectedValue);
    });

    it('middleware can handle promises returned from orchestrators', async () => {
        // Arrange
        let testAction = action('testAction');
        orchestrator(testAction, () => Promise.resolve(1));
        orchestrator(testAction, () => Promise.resolve(2));

        let returnedPromise;
        applyMiddleware((next, actionMessage) => {
            returnedPromise = next(actionMessage);
        });

        // Act
        testAction();
        let promiseValues = await returnedPromise;

        // Assert
        expect(promiseValues).toEqual([1, 2]);
    });

    it('stores created from mutators handle actions as expected', () => {
        // Arrange
        const testAction = action('testAction');
        const testMutator = createMutator({ testProperty: 1 }).handles(testAction, state => {
            state.testProperty = 2;
        });

        const testStore = createStore('testStore', testMutator)();

        // Act
        testAction();

        // Assert
        expect(testStore.testProperty).toBe(2);
    });
});
