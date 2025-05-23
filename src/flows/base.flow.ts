import { container } from 'tsyringe'

import { TextResponseBuilder } from '../builders/responses/text.js'
import { StateFacade } from '../core/state.facade.js'

import type { FlowParams, FlowResponse } from '../types/flows.js'
import type { IFlow } from '../types/interfaces.js'

export abstract class BaseFlow implements IFlow {
  constructor(
    protected readonly state = container.resolve(StateFacade),
    protected readonly responseBuilder = new TextResponseBuilder(),
  ) {}

  public abstract handle(params: FlowParams): FlowResponse | Promise<FlowResponse>
}
