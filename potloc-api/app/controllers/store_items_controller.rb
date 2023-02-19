# frozen_string_literal: true

class StoreItemsController < ApplicationController
  def index
    @store_items = StoreItem.joins(:item, :store).all
    render json: StoreItemSerializer.new(@store_items), status: 200
  end

  def update
    @store_item = StoreItem.find(params[:id])
    return unless @store_item.update({ inventory: params[:inventory] })

    ActionCable.server.broadcast(
      "store_#{@store_item.store_id}", 
      { body: StoreItemSerializer.new(@store_item), type: :inventory }
    )
    @store_item.inventory < 10 && RecommendJob.perform_later(params[:id])
  end
end
