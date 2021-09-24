import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';


export default function(group, element, translate) {

  // Only return an entry, if the currently selected
  // element is a start event.

  if (is(element, 'bpmn:StartEvent') && element.businessObject.$attrs.oasis_type === 'myMagicStart' ) {
    // group.entries.push(entryFactory.textField(translate, {
    //   id : 'spell',
    //   description : 'Apply a black magic spell',
    //   label : 'Spell',
    //   modelProperty : 'spell'
    // }));

    group.entries.push(entryFactory.selectBox(translate, {
      id : 'spell',
      description: 'Select black magic spell',
      label: 'Select Spell',
      modelProperty: 'spell',
      selectOptions: [{name:'101', value:'Skadoosh'},{name:'102', value:'Sssshhhh'}],
    }))
  }
}