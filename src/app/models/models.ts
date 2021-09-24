export class Column {
    name: string;
    type: string;
}

export enum StartEventEnum {
    timeCycle = 'timeCycle',
    timeDate = 'timeDate'
}

export enum ColumnTypeEnum {
    status = 'status',
    date='date'
};

export enum ActionEnum {
    readTaskColumnValue = 'readTaskColumnValue',
    changeTaskColumnValue = 'changeTaskColumnValue',
    notify = 'notify'
}

export enum ElementTypeEnum {
    notifytask = 'notifytask',
    changetask = 'changetask',
    readtask = 'readtask',
    timerstart = 'timerstart',
    exclusivegateway = 'exclusivegateway',
    exclusivegatewayoutgoing = 'exclusivegatewayoutgoing'
}

export enum GatewayTypeEnum{
    equal = 'equal',
    notequal = 'notequal',
    pasttoday = 'pasttoday'
}

export enum StatusColValuesEnum {
    done = 'done',
    inprogress = 'inprogress'
}