import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { type z } from "zod"

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { IFormSchema } from "@/types"
import { Form } from "./ui/form"
import { BaseForm } from "./BaseFormContent"
import { addTransaction } from "@/actions/transactions"

import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"

export function TransactionForm() {
    const router = useRouter()
    const form = useForm<z.infer<typeof IFormSchema>>({
        resolver: zodResolver(IFormSchema),
        defaultValues: {
            notes: "",
            fees: 0,
            pricePerShare: 0,
            quantity: 1,
            ticker: {
                exchDisp: '',
                shortname: '',
                symbol: ''
            },
            date: new Date(),
            type: 'buy',
        },
    })
    const { toast } = useToast()
    async function onSubmit(values: z.infer<typeof IFormSchema>) {
        try {
            await addTransaction(values);
            toast({
                title: "Added: Transaction",
                description: `Ticker: ${values.ticker.symbol}, Type: ${values.type}`,
            })
            form.reset();
            router.refresh()
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Tabs defaultValue="buy" onValueChange={(value) => form.setValue('type', value as "buy" | "sell")}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="buy">Buy</TabsTrigger>
                        <TabsTrigger value="sell">Sell</TabsTrigger>
                    </TabsList>
                    <TabsContent value="buy">
                        <BaseForm form={form} type="buy" />
                    </TabsContent>
                    <TabsContent value="sell">
                        <BaseForm form={form} type="sell" />
                    </TabsContent>
                </Tabs>
            </form>
        </Form>
    )
}
