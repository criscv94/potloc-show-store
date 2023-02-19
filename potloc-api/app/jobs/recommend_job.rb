# frozen_string_literal: true

class RecommendJob < ApplicationJob
  queue_as :default

  def perform(store_item_id)
    store_item = StoreItem.find(store_item_id)
    store_item_recommend = Item.find(store_item.item_id)
                                .store_items.where.not(store_id: store_item.store_id)
                                .order("inventory DESC").first
    return unless store_item_recommend.inventory > 30
    ActionCable.server.broadcast(
      "store_#{store_item.store_id}",
      {
        type: :recommend,
        body: { 
          data: StoreItemSerializer.new(store_item_recommend),
          original_store: store_item.store
        }
      }
    )
  end
end
