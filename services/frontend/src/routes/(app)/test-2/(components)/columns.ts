import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import {
	DataTableCheckbox,
	DataTableColumnHeader,
	DataTableCellActions,
	DataTableCellText
} from './index.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
import DataTableCellSelect from '$lib/components/data-table/data-table-cell-select.svelte';
import type { Types } from 'backend';

export const columns: ColumnDef<Types.Part>[] = [
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
			return renderComponent(DataTableColumnHeader<Types.Part, unknown>, {
				column,
				title: 'Part id'
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
		accessorKey: 'name',
		header: ({ column }) =>
			renderComponent(DataTableColumnHeader<Types.Part, unknown>, { column, title: 'Name' }),
		cell: ({ row }) => {
			return renderComponent(DataTableCellText, {
				value: row.original.name
			});
		},
		enableHiding: false
	},
	{
		id: 'actions',
		header: ({ column }) => {
			return renderComponent(DataTableColumnHeader<Types.Part, unknown>, {
				column,
				title: 'Action'
			});
		},
		cell: ({ row }) => renderComponent(DataTableCellActions, {})
	}
];
