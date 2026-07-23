import { useStore } from '../lib/StoreContext'
import { Badge, Button, Card, Field, Input, PageHeader } from '../components/ui'

export function CompanyPage() {
  const { deal, updateCompany } = useStore()
  const c = deal.company

  return (
    <div>
      <PageHeader
        title="Company setup"
        subtitle="New traders: पहले ये details भरें। Existing traders: IEC, AD code, bank, RCMC verify करें — ये PI/CI/B/L/bank lodge में बार-बार लगते हैं।"
        actions={
          <Button
            onClick={() => updateCompany({ onboardingDone: true, legalName: c.legalName || deal.companyName })}
          >
            {c.onboardingDone ? 'Saved ✓' : 'Mark setup complete'}
          </Button>
        }
      />

      <Card className="mb-6 p-5 text-sm leading-7 text-slate-600">
        <Badge tone={c.onboardingDone ? 'green' : 'amber'}>
          {c.onboardingDone ? 'Onboarding complete' : 'Complete this before sending PI to buyers'}
        </Badge>
        <p className="mt-3">
          Tip: Legal name exactly वैसा लिखें जैसा IEC / bank / GST में है — LC beneficiary mismatch सबसे
          common amateur mistake है।
        </p>
      </Card>

      <Card className="grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Legal name">
          <Input value={c.legalName} onChange={(e) => updateCompany({ legalName: e.target.value })} />
        </Field>
        <Field label="Brand / trade name">
          <Input value={c.brandName} onChange={(e) => updateCompany({ brandName: e.target.value })} />
        </Field>
        <Field label="Email">
          <Input value={c.email} onChange={(e) => updateCompany({ email: e.target.value })} />
        </Field>
        <Field label="Phone">
          <Input value={c.phone} onChange={(e) => updateCompany({ phone: e.target.value })} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Address">
            <Input value={c.address} onChange={(e) => updateCompany({ address: e.target.value })} />
          </Field>
        </div>
        <Field label="City">
          <Input value={c.city} onChange={(e) => updateCompany({ city: e.target.value })} />
        </Field>
        <Field label="State">
          <Input value={c.state} onChange={(e) => updateCompany({ state: e.target.value })} />
        </Field>
        <Field label="Country">
          <Input value={c.country} onChange={(e) => updateCompany({ country: e.target.value })} />
        </Field>
        <Field label="Postal code">
          <Input value={c.postalCode} onChange={(e) => updateCompany({ postalCode: e.target.value })} />
        </Field>
        <Field label="IEC">
          <Input value={c.iec} onChange={(e) => updateCompany({ iec: e.target.value })} />
        </Field>
        <Field label="GSTIN">
          <Input value={c.gstin} onChange={(e) => updateCompany({ gstin: e.target.value })} />
        </Field>
        <Field label="PAN">
          <Input value={c.pan} onChange={(e) => updateCompany({ pan: e.target.value })} />
        </Field>
        <Field label="AD Code">
          <Input value={c.adCode} onChange={(e) => updateCompany({ adCode: e.target.value })} />
        </Field>
        <Field label="Spices Board RCMC">
          <Input
            value={c.spicesBoardRcmc}
            onChange={(e) => updateCompany({ spicesBoardRcmc: e.target.value })}
          />
        </Field>
        <Field label="Bank name">
          <Input value={c.bankName} onChange={(e) => updateCompany({ bankName: e.target.value })} />
        </Field>
        <Field label="Account number">
          <Input
            value={c.bankAccount}
            onChange={(e) => updateCompany({ bankAccount: e.target.value })}
          />
        </Field>
        <Field label="IFSC">
          <Input value={c.bankIfsc} onChange={(e) => updateCompany({ bankIfsc: e.target.value })} />
        </Field>
        <Field label="SWIFT">
          <Input value={c.bankSwift} onChange={(e) => updateCompany({ bankSwift: e.target.value })} />
        </Field>
      </Card>
    </div>
  )
}
