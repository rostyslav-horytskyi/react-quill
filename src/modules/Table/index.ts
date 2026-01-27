import Quill from 'quill';
import TableUp, { TableSelection } from 'quill-table-up';

TableUp.register();
Quill.register('modules/table-up', TableUp, true);

export { TableSelection };
export default TableUp;
