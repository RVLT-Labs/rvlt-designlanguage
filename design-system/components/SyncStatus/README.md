# SyncStatus

Connection state as a dot plus a word: Synced (`ok`), Syncing… n (`warn`), Offline (`muted`).

7px dot with a 2px halo in its own soft colour (`ok-soft`, `warn-soft`, `muted-soft`); 12px `muted` word; the pending count in Geist Mono. Offline is a state, not an error — it never turns red. The count of waiting changes lives in the OfflineBanner, not here.

_Static rendition hand-written from RVLT-Labs/binder `apps/web/src/components/SyncStatus.tsx`._
