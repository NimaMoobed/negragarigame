// useUnlocked — وضعیت قفل ۳ دسته
// منطق: همه‌ی دسته‌ها قفل‌اند مگر اینکه id آن‌ها در array 'unlocked' باشد.
// پس از زدن دکمه‌ی "ریویو دادم، باز کن" همه‌ی id ها unlock می‌شوند (اعتماد به کاربر).

import { useEffect, useState, useCallback } from 'react';
import { getJson, setJson } from '../lib/storage';
import { CATEGORIES, type CategoryId } from '../data/categories';

const KEY = 'unlocked';

// دسته‌هایی که از روز اول باز هستند (locked: false در CATEGORIES)
const ALWAYS_OPEN: CategoryId[] = CATEGORIES.filter(c => !c.locked).map(c => c.id);

export function useUnlocked() {
  const [unlocked, setUnlocked] = useState<CategoryId[]>(ALWAYS_OPEN);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await getJson<CategoryId[]>(KEY);
      if (saved && Array.isArray(saved)) {
        // ادغام با ALWAYS_OPEN (که همیشه باز است)
        const merged = Array.from(new Set([...ALWAYS_OPEN, ...saved]));
        setUnlocked(merged);
      }
      setLoaded(true);
    })();
  }, []);

  const isUnlocked = useCallback(
    (id: CategoryId) => unlocked.includes(id),
    [unlocked],
  );

  const unlockAll = useCallback(async () => {
    const all = CATEGORIES.map(c => c.id);
    setUnlocked(all);
    await setJson(KEY, all);
  }, []);

  return { unlocked, isUnlocked, unlockAll, loaded };
}
