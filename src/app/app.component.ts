//import magicModdleDescriptor from './descriptors/magic.json';
// import propertiesPanelModule from 'bpmn-js-properties-panel';
// import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import Modeler from 'bpmn-js/lib/Modeler.js';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda.json';
import lintModule from 'bpmn-js-bpmnlint';


import { Linter } from 'bpmnlint';
import linterConfig from 'packed-config.js';

import customModule from './CustomProviders';
import {
  ElementTypeEnum,
  ColumnTypeEnum,
  GatewayTypeEnum,
  StatusColValuesEnum,
} from './models/models';
import {
  is
} from 'bpmn-js/lib/util/ModelUtil';


const HIGH_PRIORITY = 1500;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Workflow Modeler';
  modeler: Modeler;
  moddle;
  modeling;
  selectedElementType: ElementTypeEnum;
  element;
  selectedGatewayColType: ColumnTypeEnum;
  selectedGatewayColId: string;
  outputVariableId: string;

  @ViewChild('canvas')
  private canvesRef: ElementRef;

  constructor(private http: HttpClient) {}

  getUrlParam(name) {
    var url = new URL(window.location.href);
  
    return url.searchParams.has(name);
  }

  ngOnInit(): void {
    this.modeler = new Modeler({
      container: '#canvas',
      width: '100%',
      height: '600px',
      // propertiesPanel: {
      //   parent: '#properties',
      // },
      additionalModules: [customModule, lintModule], //propertiesPanelModule, propertiesProviderModule
      moddleExtensions: {
        camunda: camundaModdleDescriptor,
        //magic: magicModdleDescriptor,
      },
      linting: {
        bpmnlint: linterConfig,
        active: true
      }
    });
    (this.moddle = this.modeler.get('moddle')),
      (this.modeling = this.modeler.get('modeling'));

    this.modeler.on('element.click', 1500, (event) => {
      event.originalEvent.preventDefault();
      event.originalEvent.stopPropagation();

      const { element } = event;
      this.element = element;
      this.selectedElementType = element.businessObject.$attrs.rpmstype;
      if (this.selectedElementType === ElementTypeEnum.exclusivegateway) {
        // check read task type output from incoming route
        this.setValuesForGatewayType();
      } else if (is(element, 'bpmn:SequenceFlow') && element.businessObject.sourceRef.$attrs?.rpmstype === ElementTypeEnum.exclusivegateway){
        this.selectedElementType = ElementTypeEnum.exclusivegatewayoutgoing;
        this.outputVariableId = element.businessObject.sourceRef.$attrs?.rpmsoutputvariable;
        this.selectedGatewayColType = element.businessObject.sourceRef.$attrs?.rpmscoltype;
        this.selectedGatewayColId = element.businessObject.sourceRef.$attrs?.rpmscolid;
      }
    });

    this.modeler.on('element.mouseup', HIGH_PRIORITY, (event) => {
      const { element } = event;
      this.element = element;
      this.selectedElementType = element.businessObject.$attrs.rpmstype;
      if (this.selectedElementType === ElementTypeEnum.exclusivegateway) {
        // check read task type output from incoming route
        this.setValuesForGatewayType();
      }
    });

    this.load();
  }

  changeOutgoingStatusFlow(eventArgs){
    if(eventArgs.target.value === '0'){
      delete this.element.businessObject['conditionExpression'];
      delete this.element.businessObject['name'];
      this.modeling.updateProperties(this.element, { name: '' });
    } else {
      let exp = this.moddle.create('bpmn:FormalExpression');

      exp.$parent = this.element;
      exp['body']= "$" +`{${this.outputVariableId} == '${eventArgs.target.value}'}`;
      this.element.businessObject['conditionExpression'] = exp;

      if(eventArgs.target.value === StatusColValuesEnum.done){
        this.modeling.updateProperties(this.element, { name: 'Done' });
      } else if(eventArgs.target.value === StatusColValuesEnum.inprogress) {
        this.modeling.updateProperties(this.element, { name: 'In Progress' });
      }
    }
  }

  setValuesForGatewayType() {
    if (this.element?.businessObject?.incoming) {
      const incoming = this.element?.businessObject?.incoming[0];
      if (incoming) {
        if (
          incoming?.sourceRef?.$attrs?.rpmstype === ElementTypeEnum.readtask
        ) {
          const colType = incoming?.sourceRef?.$attrs?.rpmscoltype;
          const colid = incoming?.sourceRef?.$attrs?.rpmscolid;
          const outvarId = incoming?.sourceRef?.id;

          this.selectedGatewayColType = colType;
          this.selectedGatewayColId = colid;
          this.outputVariableId = outvarId;
        }
      }
    }
  }

  changeStatusGateway(eventArgs) {
    if (eventArgs.target.value === '0') {
      delete this.element.businessObject.$attrs['rpmscoltype'];
      delete this.element.businessObject.$attrs['rpmscolid'];
      delete this.element.businessObject.$attrs['rpmsgatewaytype'];
      delete this.element.businessObject.$attrs['rpmsoutputvariable'];
      delete this.element.businessObject.$attrs['name'];
      this.modeling.updateProperties(this.element, { name: '' });
    } else {
      this.element.businessObject.$attrs['rpmscoltype'] =
        this.selectedGatewayColType;
      this.element.businessObject.$attrs['rpmscolid'] =
        this.selectedGatewayColId;
      this.element.businessObject.$attrs['rpmsgatewaytype'] =
        eventArgs.target.value;
      this.element.businessObject.$attrs['rpmsoutputvariable'] =
        this.outputVariableId;

      let name = 'Equal';

      if (eventArgs.target.value === GatewayTypeEnum.notequal) {
        name = 'Not Equal';
      }

      this.modeling.updateProperties(this.element, { name: name });
    }
  }

  changeDateGateway(eventArgs) {
    if (eventArgs.target.value === '0') {
      delete this.element.businessObject.$attrs['rpmscoltype'];
      delete this.element.businessObject.$attrs['rpmscolid'];
      delete this.element.businessObject.$attrs['rpmsgatewaytype'];
      delete this.element.businessObject.$attrs['name'];
      delete this.element.businessObject.$attrs['rpmsoutputvariable'];
      this.modeling.updateProperties(this.element, { name: '' });
    } else {
      this.element.businessObject.$attrs['rpmscoltype'] =
        this.selectedGatewayColType;
      this.element.businessObject.$attrs['rpmscolid'] =
        this.selectedGatewayColId;
      this.element.businessObject.$attrs['rpmsgatewaytype'] =
        eventArgs.target.value;
      this.element.businessObject.$attrs['rpmsoutputvariable'] =
        this.outputVariableId;
      this.modeling.updateProperties(this.element, { name: 'Past Today' });
    }
  }

  changeTimer(eventArgs) {
    const timerEventDefinition =
      this.element.businessObject.eventDefinitions.filter((timerEventDef) => {
        return timerEventDef.$instanceOf('bpmn:TimerEventDefinition');
      })[0];
    let exp = this.moddle.create('bpmn:FormalExpression');

    if (eventArgs.target.value === '0') {
      delete timerEventDefinition['timeCycle'];
    } else {
      if (eventArgs.target.value === '5') {
        exp['body'] = 'R/P5M';
      } else if (eventArgs.target.value === '10') {
        exp['body'] = 'R/P10M';
      }
      exp.$parent = timerEventDefinition;
      timerEventDefinition['timeCycle'] = exp;
      this.modeling.updateProperties(this.element, {});
    }
  }

  changeReadTaskColumnType(eventArgs) {
    if (eventArgs.target.value === '0') {
      delete this.element.businessObject['extensionElements'];
    } else {
      const extensionElements = this.moddle.create('bpmn:ExtensionElements');
      extensionElements.$parent = this.element.businessObject;
      const io = this.moddle.create('camunda:InputOutput');

      const outputVariable = this.moddle.create('camunda:InputParameter');
      outputVariable['name'] = 'outputVariable';
      outputVariable['value'] = this.element.businessObject.id; // this can be set as this.element.businessObject.id to keep uniqueness
      outputVariable.$parent = io;

      const pathParams = this.moddle.create('camunda:InputParameter');
      pathParams['name'] = 'pathParams';
      pathParams.$parent = io;

      const script = this.moddle.create('camunda:Script');
      script.$parent = pathParams;
      script['scriptFormat'] = 'javascript';
      script['value'] = `var json = S("{}");
        json.prop("taskColumnId", '${eventArgs.target.value}');
        json`;

      pathParams['definition'] = script;

      io.$parent = extensionElements;
      io['inputParameters'] = [outputVariable, pathParams];

      extensionElements['values'] = [io];
      this.element.businessObject['extensionElements'] = extensionElements;

      if (eventArgs.target.value === 'status-col-id') {
        this.element.businessObject.$attrs['rpmscoltype'] =
          ColumnTypeEnum.status;
      } else {
        this.element.businessObject.$attrs['rpmscoltype'] = ColumnTypeEnum.date;
      }

      this.element.businessObject.$attrs['rpmscolid'] = eventArgs.target.value;
    }
  }

  changeRecipient(eventArgs) {
    if (eventArgs.target.value === '0') {
      delete this.element.businessObject['extensionElements'];
    } else {
      const extensionElements = this.moddle.create('bpmn:ExtensionElements');
      extensionElements.$parent = this.element.businessObject;
      const io = this.moddle.create('camunda:InputOutput');

      const notificationParams = this.moddle.create('camunda:InputParameter');
      notificationParams['name'] = 'notificationParams';
      notificationParams.$parent = io;
      const script = this.moddle.create('camunda:Script');
      script.$parent = notificationParams;
      script['scriptFormat'] = 'javascript';

      script['value'] = `var json = S("{}");
      json.prop("type", "email");
      json.prop("alertTemplate", "custom");
      json.prop("recipientType", "specific_people");
      json.prop("recipients", "['${eventArgs.target.value}']");
      json.prop("message", "Hi FROM AUTOMATION");
      json.prop("subject", "Oasis Automation");
      json`;

      notificationParams['definition'] = script;
      io.$parent = extensionElements;
      io['inputParameters'] = [notificationParams];
      extensionElements['values'] = [io];
      this.element.businessObject['extensionElements'] = extensionElements;
    }
  }

  load(): void {
    this.getExample().subscribe((data) => {
      this.modeler.importXML(data, (value) => this.handleError(value));
    });
  }

  handleError(err: any) {
    if (err) {
      console.warn('Ups, error: ', err);
    }
  }

  public getExample(): Observable<string> {
    const url = '/assets/emptyBpmn.xml'; // local
    return this.http.get(url, { responseType: 'text' });
  }

  public save() {
    this.modeler.saveXML({ format: true }).then((data) => {
      const { xml } = data;

      if (xml) {
        var encodedData = encodeURIComponent(xml);

        let link = document.createElement('a');
        link.setAttribute('type', 'hidden');
        link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData;
        link.download = 'test.xml';
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    });
  }
}
