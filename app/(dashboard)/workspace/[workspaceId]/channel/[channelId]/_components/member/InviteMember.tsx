'use client';

import { inviteMemberSchema, InviteMemberSchemaType } from '@/app/schemas/member';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function InviteMember() {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  function onSubmit(values: InviteMemberSchemaType) {
    console.log(values);
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Invite a new member to the channel using thier email
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">
              <Send />
              Send Invitation
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
