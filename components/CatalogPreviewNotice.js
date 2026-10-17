import { TEST_IDS } from './testIds';

export default function CatalogPreviewNotice() {
  return (
    <aside className="catalog-preview" role="status" data-testid={TEST_IDS.catalogPreviewNotice}>
      <strong>Demo catalog preview</strong>
      <span>The store API is offline. Sample products can be added to the preview cart; checkout is disabled.</span>
    </aside>
  );
}
