<script lang="ts">
  import DataTable from "./data-table.svelte";
  import * as Card from '$lib/components/ui/card';

	type Payment = {
		id: string;
		amount: number;
		status: 'pending' | 'processing' | 'success' | 'failed';
		email: string;
	};

  const data: Payment[] = [
		{
			id: '728ed52f',
			amount: 100,
			status: 'pending',
			email: 'm@example.com'
		},
		{
			id: '489e1d42',
			amount: 125,
			status: 'processing',
			email: 'example@gmail.com'
		},
		{
			id: '9a21d48c',
			amount: 250,
			status: 'success',
			email: 'john.doe@yahoo.com'
		},
		{
			id: '5b42c67a',
			amount: 75,
			status: 'failed',
			email: 'susan@example.com'
		},
		{
			id: '3d89a56b',
			amount: 300,
			status: 'pending',
			email: 'alex.smith@hotmail.com'
		},
		{
			id: '8f65e93d',
			amount: 150,
			status: 'success',
			email: 'laura@example.net'
		},
		{
			id: '47f3b71e',
			amount: 200,
			status: 'processing',
			email: 'david.b@example.com'
		},
		{
			id: 'e81c457b',
			amount: 180,
			status: 'pending',
			email: 'kelly.jones@gmail.com'
		},
		{
			id: '12a34bc5',
			amount: 95,
			status: 'failed',
			email: 'roger@example.org'
		},
		{
			id: '93b87e2c',
			amount: 275,
			status: 'success',
			email: 'victoria@example.com'
		}
	];

 </script>
  
 <div class="container mx-auto py-4 px-4">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <Card.Root class="col-span-1 md:col-span-2">
    <Card.Header>
      <Card.Title>Production Systems</Card.Title>
    </Card.Header>
    <Card.Content>
      <DataTable data={data}/>
    </Card.Content>
  </Card.Root>
  </div>
 </div>