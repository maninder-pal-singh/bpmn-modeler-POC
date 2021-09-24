import CustomContextPad from './CustomContextPad';
import CustomPalette from './CustomPalette';
import CustomRenderer from './CustomRenderer';
import MagicPropertiesProvider from './MagicPropertiesProvider';

export default {
  __init__: [ 'customContextPad', 'customPalette', ,   ], //'magicPropertiesProvider','customRenderer'
  customContextPad: [ 'type', CustomContextPad ],
  customPalette: [ 'type', CustomPalette ],
  //customRenderer: [ 'type', CustomRenderer ],
  //magicPropertiesProvider: [ 'type', MagicPropertiesProvider ],
};