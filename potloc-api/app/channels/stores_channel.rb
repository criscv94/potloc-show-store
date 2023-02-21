# frozen_string_literal: true

class StoresChannel < ApplicationCable::Channel
  def subscribed
    return unless Store.find(params[:store_id])
    stream_from "store_#{params[:store_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
