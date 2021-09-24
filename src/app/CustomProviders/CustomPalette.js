const SUITABILITY_SCORE_HIGH = 100,
      SUITABILITY_SCORE_AVERGE = 50,
      SUITABILITY_SCORE_LOW = 25;

export default class CustomPalette {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const {
      bpmnFactory,
      create,
      elementFactory,
      translate
    } = this;

    function createTask(suitabilityScore) {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:Task');

        businessObject.suitable = suitabilityScore;

        const shape = elementFactory.createShape({
          type: 'bpmn:Task',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }

    function createTimerStartEvent() {
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:StartEvent', {'rpmstype':'timerstart', 'name':'Trigger on Interval'});

        const shape = elementFactory.createShape({
          type: 'bpmn:StartEvent',
          eventDefinitionType: 'bpmn:TimerEventDefinition',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }

    function createReadTaskColumnValueServiceTask(){
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:ServiceTask', {'rpmstype':'readtask', 'name':'Read Task Column Value'});

        const shape = elementFactory.createShape({
          type: 'bpmn:ServiceTask',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }

    function createChangeTaskColumnValueServiceTask(){
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:ServiceTask', {'rpmstype':'changetask', 'name':'Change Task Column Value'});

        const shape = elementFactory.createShape({
          type: 'bpmn:ServiceTask',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }

    function createNotifyServiceTask(){
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:ServiceTask', {'rpmstype':'notifytask', 'name':'Notify'});

        const shape = elementFactory.createShape({
          type: 'bpmn:ServiceTask',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }

    function createExclusiceGateway(){
      return function(event) {
        const businessObject = bpmnFactory.create('bpmn:ExclusiveGateway', {'rpmstype':'exclusivegateway'});

        const shape = elementFactory.createShape({
          type: 'bpmn:ExclusiveGateway',
          businessObject: businessObject
        });

        create.start(event, shape);
      };
    }

    return {
      'create.timer-event': {
        group: 'activity',
        className: 'bpmn-icon-start-event-timer',
        title: translate('Timer Start Event'),
        action: {
          dragstart: createTimerStartEvent(),
          click: createTimerStartEvent()
        }
      },
      'create.read-task': {
          group: 'activity',
          className: 'bpmn-icon-service red',
          title: translate('Create Read Task Column Value Service'),
          action: {
            dragstart: createReadTaskColumnValueServiceTask(),
            click: createReadTaskColumnValueServiceTask()
          }
        },'create.change-task': {
          group: 'activity',
          className: 'bpmn-icon-service green',
          title: translate('Create Change Task Column Value Service'),
          action: {
            dragstart: createChangeTaskColumnValueServiceTask(),
            click: createChangeTaskColumnValueServiceTask(),
          }
        },'create.notify-task': {
          group: 'activity',
          className: 'bpmn-icon-service yellow',
          title: translate('Create Notify Service'),
          action: {
            dragstart: createNotifyServiceTask(),
            click: createNotifyServiceTask()
          }
        },'create.exclusive-gateway': {
          group: 'activity',
          className: 'bpmn-icon-gateway-xor',
          title: translate('Create Exclusice Gateway'),
          action: {
            dragstart: createExclusiceGateway(),
            click: createExclusiceGateway()
          }
        }
    };
  }
}

CustomPalette.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
];