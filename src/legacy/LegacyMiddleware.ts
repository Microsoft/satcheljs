import ActionContext from './ActionContext';
import DispatchFunction from './LegacyDispatchFunction';
import ActionFunction from './ActionFunction';

interface Middleware {
    (next: DispatchFunction, action: ActionFunction, actionType: string, args: IArguments, actionContext: ActionContext): void;
}

export default Middleware;
