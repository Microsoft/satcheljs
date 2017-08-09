import ActionCreator from './interfaces/ActionCreator';
import SimpleAction from './interfaces/SimpleAction';
import Subscriber from './interfaces/Subscriber';
import { boundActionCreator } from './actionCreator';
import mutator from './mutator';
import orchestrator from './orchestrator';

export function createSimpleSubscriber(decorator: Function) {
    return function simpleSubscriber<T extends SimpleAction>(actionType: string, target: T): T {
        // Create the action creator
        let simpleActionCreator = boundActionCreator(actionType, function simpleActionCreator() {
            return {
                args: arguments,
            };
        });

        // Create the subscriber
        decorator(simpleActionCreator, function simpleSubscriberCallback(actionMessage: any) {
            target.apply(null, actionMessage.args);
        });

        // Return a function that dispatches that action
        return (simpleActionCreator as any) as T;
    };
}

export const simpleMutator = createSimpleSubscriber(mutator);
export const simpleOrchestrator = createSimpleSubscriber(orchestrator);
