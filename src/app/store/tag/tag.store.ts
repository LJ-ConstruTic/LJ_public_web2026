import { ComponentStore } from '@ngrx/component-store';
import { TagState, initialTagState } from './tag.state';
import { computed, inject, Injectable } from '@angular/core';
import { TagDataModel } from '../../core/model/tags-dto';
import { switchMap, tap } from 'rxjs';
import { TagService } from '../../core/services/tags.service';

@Injectable()
export class TagStore extends ComponentStore<TagState> {
    readonly tagService = inject(TagService);

    readonly $tags = this.selectSignal((state) => state.tags);
    readonly $selectedTag = this.selectSignal((state) => state.selectedTag);
    readonly $total = this.selectSignal((state) => state.total);
    readonly $loading = this.selectSignal((state) => state.loading);
    readonly $error = this.selectSignal((state) => state.error);

    readonly $weAreImgUrl = computed(() =>this.$tags()
        .find(tag =>  tag.isActive && tag.internationalization.keyLabel === 'headWeAre')?.internationalization.imgUrl[0] ?? null
    );

    readonly $activeTags = computed(() =>
        this.$tags()
            .filter((tag) => tag.isActive)
            .sort((a, b) => a.idx - b.idx)
    );

    readonly $tagByKeyLabel = (keyLabel: string) =>
        computed(() =>
            this.$tags().find((tag) => tag.internationalization.keyLabel === keyLabel) ?? null
        );

    constructor() {
        super(initialTagState);
    }

    // Updaters:
    readonly setLoading = this.updater<boolean>((state, loading) => ({
        ...state,
        loading,
    }));

    readonly setError = this.updater<string | null>((state, error) => ({
        ...state,
        error,
    }));

    readonly setTags = this.updater<TagDataModel[]>((state, tags) => ({
        ...state,
        tags,
    }));

    readonly setSelectedTag = this.updater<TagDataModel | null>((state, selectedTag) => ({
        ...state,
        selectedTag,
    }));

    readonly setTotal = this.updater<number>((state, total) => ({
        ...state,
        total,
    }));

    // Effects:
    readonly loadAllTags = this.effect<void>((trigger$) =>
        trigger$.pipe(
            tap(() => {
                this.setLoading(true);
                this.setError(null);
            }),
            switchMap(() =>
                this.tagService.getAllTags().pipe(
                    tap({
                        next: (response) => {
                            this.setTags(response.items ?? []);
                            this.setTotal(response.size ?? 0);
                            this.setLoading(false);
                        },
                        error: (error) => {
                            console.error('Error loading tags:', error);
                            this.setError('Error loading tags');
                            this.setLoading(false);
                        },
                    })
                )
            )
        )
    );

    readonly loadTagById = this.effect<number>((trigger$) =>
        trigger$.pipe(
            tap(() => {
                this.setLoading(true);
                this.setError(null);
            }),
            switchMap((id) =>
                this.tagService.getTagById(id).pipe(
                    tap({
                        next: (tag) => {
                            this.setSelectedTag(tag);
                            this.setLoading(false);
                        },
                        error: (error) => {
                            console.error('Error loading tag:', error);
                            this.setError('Error loading tag');
                            this.setLoading(false);
                        },
                    })
                )
            )
        )
    );
}