import type { ColumnDef } from '@tanstack/table-core';
import { priorities, statuses } from '../(data)/data.js';
import { createRawSnippet } from 'svelte';
import type { Task } from '../(data)/schema';
import {
	DataTableCheckbox,
	DataTableColumnHeader,
	DataTableCellActions,
	DataTableCellText
} from './index.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
import DataTableCellSelect from '$lib/components/data-table/data-table-cell-select.svelte';

export const columns: ColumnDef<Task>[] = [
	{
		id: 'select',
		header: ({ table }) =>
			renderComponent(DataTableCheckbox, {
				checked: table.getIsAllPageRowsSelected(),
				onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
				'aria-label': 'Select all',
				class: 'translate-y-[2px]'
			}),
		cell: ({ row }) =>
			renderComponent(DataTableCheckbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value) => row.toggleSelected(!!value),
				'aria-label': 'Select row',
				class: 'translate-y-[2px]'
			}),
		enableSorting: false,
		enableHiding: false
	},
	{
		accessorKey: 'id',
		header: ({ column }) => {
			return renderComponent(DataTableColumnHeader<Task, unknown>, {
				column,
				title: 'Task'
			});
		},
		cell: ({ row }) => {
			const idSnippet = createRawSnippet<[string]>((getId) => {
				const id = getId();
				return {
					render: () => `<div class="w-[80px]">${id}</div>`
				};
			});

			return renderSnippet(idSnippet, row.getValue('id'));
		},
		enableSorting: false,
		enableHiding: false
	},
	{
		accessorKey: 'title',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<Task, unknown>, { column, title: 'Title' }),
		cell: ({ row }) => {
			return renderComponent(DataTableCellText, {
				value: row.original.title
			});
		}
	},
	{
		accessorKey: 'status',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<Task, unknown>, {
				column,
				title: 'Status'
			}),
		cell: ({ row }) => {
			return renderComponent(DataTableCellSelect, {
				value: row.original.status,
				choices: statuses
			});
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		}
	},
	{
		accessorKey: 'priority',
		header: ({ column }) => {
			return renderComponent(DataTableColumnHeader<Task, unknown>, {
				title: 'Priority',
				column
			});
		},
		cell: ({ row }) => {
			return renderComponent(DataTableCellSelect, {
				value: row.original.priority,
				choices: priorities
			});
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		}
	},
	{
		id: 'actions',
		cell: () => renderComponent(DataTableCellActions, {})
	}
];
