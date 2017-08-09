import 'jasmine';
import { actionCreator, boundActionCreator, getPrivateActionId } from '../src/actionCreator';
import * as createActionId from '../src/createActionId';
import * as dispatcher from '../src/dispatcher';

describe('actionCreator', () => {
    it('returns the created action message', () => {
        // Arrange
        const testAction = actionCreator('testAction', (arg0, arg1) => {
            return {
                arg0,
                arg1,
            };
        });

        // Act
        let actionMessage = testAction('value0', 'value1');

        // Assert
        expect(actionMessage.arg0).toBe('value0');
        expect(actionMessage.arg1).toBe('value1');
    });

    it('returns a default action message if no factory is provided', () => {
        // Arrange
        const testAction = actionCreator('testAction');

        // Act
        let actionMessage = testAction();

        // Assert
        expect(actionMessage).not.toBeNull();
    });

    it('stamps the action message with the type and private action ID', () => {
        // Arrange
        spyOn(createActionId, 'default').and.returnValue('id0');
        let actionType = 'testAction';
        const testAction = actionCreator(actionType);

        // Act
        let actionMessage = testAction();

        // Assert
        expect((actionMessage as any).type).toBe(actionType);
        expect(getPrivateActionId(actionMessage)).toBe('id0');
    });

    it('does not dispatch the action message', () => {
        // Arrange
        const testAction = actionCreator('testAction');
        spyOn(dispatcher, 'dispatch');

        // Act
        testAction();

        // Assert
        expect(dispatcher.dispatch).not.toHaveBeenCalled();
    });

    it('throws if the action message already has a type', () => {
        // Arrange
        const testAction = actionCreator('testAction', () => {
            return { type: 'testAction' };
        });

        // Act / Assert
        expect(testAction).toThrow();
    });

    it('gets stamped with the private action ID', () => {
        // Arrange
        spyOn(createActionId, 'default').and.returnValue('id1');

        // Act
        const testAction = actionCreator('testAction');

        // Assert
        expect(getPrivateActionId(testAction)).toBe('id1');
    });
});

describe('boundActionCreator', () => {
    it('dispatches the action message', () => {
        // Arrange
        let actionMessage = {};
        const testAction = boundActionCreator('testAction', () => actionMessage);
        spyOn(dispatcher, 'dispatch');

        // Act
        testAction();

        // Assert
        expect(dispatcher.dispatch).toHaveBeenCalledWith(actionMessage);
    });
});
